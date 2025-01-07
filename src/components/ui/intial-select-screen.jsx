import { useState } from "react";
import { Button } from "./button";
import { useNavigate } from "react-router";
import supabase from "../../supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { traitorImgs } from "../../constants/traitorsImg";

function InitialSelectScreen() {
  const { user, isLoaded } = useUser();
  const [selectedTraitors, setSelectedTraitors] = useState([]);
  let navigate = useNavigate();

  function handleSelect(id) {
    if (selectedTraitors.includes(id)) {
      setSelectedTraitors(
        selectedTraitors.filter((traitorId) => traitorId !== id)
      );
    } else {
      if (selectedTraitors.length < 1) {
        setSelectedTraitors([...selectedTraitors, id]);
      } else {
        setSelectedTraitors([selectedTraitors[0], id]);
      }
    }
  }

  async function handleClick() {
    if (isLoaded) {
      const { data, error } = await supabase
        .from("users")
        .update([
          {
            selected_winner: selectedTraitors[0],
          },
        ])
        .eq("username", user.username);
      if (error) {
        console.log(error);
      } else {
        console.log("Selected Winner: ", data);
        navigate("/");
      }
    }
  }

  return (
    <>
      <div>
        <h3> Select Your Winner Guess </h3>
      </div>
      {traitorImgs.map((img) => (
        <img
          src={img.path}
          key={img.id}
          onClick={() => handleSelect(img.id)}
          className={`cursor-pointer p-1 ${
            selectedTraitors.includes(img.id)
              ? "ring-4 ring-yellow-600"
              : "ring-0"
          } `}
        />
      ))}
      <Button onClick={() => handleClick()}> Submit </Button>
    </>
  );
}

export default InitialSelectScreen;
