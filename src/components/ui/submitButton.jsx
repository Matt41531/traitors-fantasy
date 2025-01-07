/* eslint-disable react/prop-types */
import { Button } from "./button";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import supabase from "../../supabaseClient";

function SubmitButton({ selectedTraitors, teamName }) {
  const { user, isLoaded } = useUser();
  let navigate = useNavigate();

  async function handleClick() {
    if (isLoaded) {
        const { data, error } = await supabase
        .from("users")
        .insert([
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
      }
      navigate("/draft-winner");
    }
  }

  return <Button onClick={() => handleClick()}> Submit </Button>;
}

export default SubmitButton;
