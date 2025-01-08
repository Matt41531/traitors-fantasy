/* eslint-disable react/prop-types */
import { Button } from "./button";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import supabase from "../../supabaseClient";

function SubmitButton({ selectedTraitors, teamName }) {
  const { user, isLoaded } = useUser();
  let navigate = useNavigate();

  const isTeamNameValid = teamName && teamName.length <= 20;
  const isFormValid = selectedTraitors.length === 4 && isTeamNameValid;

  let errorMessage = "";
  if (selectedTraitors.length < 4) {
    errorMessage = "Please Select 4 Traitors";
  } else if (!teamName) {
    errorMessage = "Please Add a Valid Team Name";
  } else if (teamName.length > 20) {
    errorMessage = "Please Limit Your Team Name to 20 Characters";
  }

  async function handleClick() {
    if (isLoaded) {
      const { data, error } = await supabase.from("users").insert([
        {
          username: user.username,
          team_name: teamName,
          traitor_1: selectedTraitors[0],
          traitor_2: selectedTraitors[1],
          traitor_3: selectedTraitors[2],
          traitor_4: selectedTraitors[3],
          total_points: 0,
        },
      ]);
      if (error) {
        console.log("Error inserting data");
      } else {
        console.log("Data inserted: ", data);
        navigate("/draft-winner");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!isFormValid &&(
        <p className="text-red-600">{errorMessage}</p>
      )}
      <Button
        className={`m-4 w-full ${isFormValid ? "bg-green-500" : ""}`}
        onClick={handleClick}
        disabled={!isFormValid}
      >
        Submit 🗡️
      </Button>
    </div>
  );
}

export default SubmitButton;
