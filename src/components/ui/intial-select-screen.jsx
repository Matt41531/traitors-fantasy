import { useState } from "react";
import { Button } from "./button";
import { useNavigate } from "react-router";
import supabase from "../../supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { traitorImgs } from "../../constants/traitorsImg";

function InitialSelectScreen() {
  const { user, isLoaded } = useUser();
  const [selectedTraitor, setSelectedTraitor] = useState([]);
  const [errorMessage, setErrorMessage] = useState(
    "Please Select A Predicted Winner"
  );
  let navigate = useNavigate();

  function handleSelect(id) {
    if (selectedTraitor.includes(id)) {
      setSelectedTraitor(
        selectedTraitor.filter((traitorId) => traitorId !== id)
      );
      setErrorMessage("Please Select A Predicted Winner");
    } else {
      setSelectedTraitor([id]);
      setErrorMessage("");
    }
  }

  async function handleClick() {
    if (isLoaded) {
      const { data, error } = await supabase
        .from("users")
        .update([
          {
            selected_winner: selectedTraitor[0],
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
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="font-bold m-5"> 🏆 Select Your Predicted Winner 🏆</h2>
      {traitorImgs.map((img) => (
        <img
          src={img.path}
          key={img.id}
          onClick={() => handleSelect(img.id)}
          className={`cursor-pointer p-1 ${
            selectedTraitor.includes(img.id)
              ? "ring-4 ring-yellow-600"
              : "ring-0"
          } `}
        />
      ))}
      <p className="text-red-600">{errorMessage}</p>
      <Button
        className={`m-4 w-full ${
          selectedTraitor.length == 1 ? "bg-green-500" : ""
        }`}
        onClick={() => handleClick()}
        disabled={selectedTraitor.length !== 1}
      >
        {" "}
        Submit 🏆{" "}
      </Button>
    </div>
  );
}

export default InitialSelectScreen;
