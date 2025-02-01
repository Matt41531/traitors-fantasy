import { Input } from "./input";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

function LeagueSetup() {
  const [leagueCode, setLeagueCode] = useState(
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  const [inputLeagueCode, setInputLeagueCode] = useState("");
  const [isCreateNewLeague, setIsCreateNewLeague] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  let navigate = useNavigate();

  useEffect(() => {
    const checkUserLeague = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_leagues")
        .select("league_code")
        .eq("username", user.username)
        .single();

      if (!error && data) {
        navigate("/draft");
      }
    };

    checkUserLeague();
  }, [user, navigate]);

  function handleJoinClick() {
    setIsCreateNewLeague(false);
    setError("");
  }

  function handleCreateClick() {
    if (!isCreateNewLeague) {
      setIsCreateNewLeague(true);
      setLeagueCode(Math.random().toString(36).substring(2, 6).toUpperCase());
      setError("");
    }
  }

  async function handleSubmit() {
    if (!user) {
      setError("Please sign in to continue");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First create user if they don't exist - only with username
      const { error: userError } = await supabase
        .from("users")
        .upsert([
          {
            username: user.username,
          },
        ], 
        { onConflict: 'username' });

      if (userError) throw userError;

      if (isCreateNewLeague) {
        // Check if league code already exists
        const { data: existingLeague } = await supabase
          .from("leagues")
          .select("league_code")
          .eq("league_code", leagueCode)
          .single();

        if (existingLeague) {
          // Generate new code if exists
          const newCode = Math.random().toString(36).substring(2, 6).toUpperCase();
          setLeagueCode(newCode);
          throw new Error("League code already exists, trying again with new code");
        }

        // Create new league
        const { error: leagueError } = await supabase
          .from("leagues")
          .insert({
            league_code: leagueCode,
            created_by_username: user.username,
          });

        if (leagueError) throw leagueError;
      } else {
        // Verify league exists for joining
        const { data: leagueData, error: leagueError } = await supabase
          .from("leagues")
          .select("league_code")
          .eq("league_code", inputLeagueCode)
          .single();

        if (leagueError || !leagueData) {
          throw new Error("Invalid league code");
        }
      }

      // Add user to user_leagues
      const { error: userLeagueError } = await supabase
        .from("user_leagues")
        .insert({
          league_code: isCreateNewLeague ? leagueCode : inputLeagueCode,
          username: user.username,
        });

      if (userLeagueError) {
        throw userLeagueError;
      }

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join or Create a Fantasy League</CardTitle>
          <CardDescription>
            {isCreateNewLeague 
              ? "Create a new league and share the code with friends" 
              : "Enter an existing league code to join"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCreateNewLeague ? (
            <div className="text-center text-2xl font-bold">{leagueCode}</div>
          ) : (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                placeholder="Enter league code" 
                value={inputLeagueCode}
                onChange={(e) => setInputLeagueCode(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
          )}
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-center items-center w-full gap-2">
            <Button
              className={`w-1/2 ${!isCreateNewLeague ? 'bg-blue-600' : 'bg-blue-400'}`}
              onClick={handleJoinClick}
              disabled={isLoading}
            >
              Join League
            </Button>
            <Button
              className={`w-1/2 ${isCreateNewLeague ? 'bg-green-600' : 'bg-green-400'}`}
              onClick={handleCreateClick}
              disabled={isLoading}
            >
              Create League
            </Button>
          </div>
          <Button
            className="w-full bg-yellow-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LeagueSetup;
