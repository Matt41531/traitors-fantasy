import { useState, useEffect } from "react";
import SubmitButton from "./submitButton";
import { Input } from "./input";
import supabase from "../../supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { traitorImgs } from "../../constants/traitorsImg";

function TraitorsLayout() {
  const [selectedTraitors, setSelectedTraitors] = useState([]);
  const [teamName, setTeamName] = useState("");
  const { user } = useUser();
  const [userAccount, setUserAccount] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    const fetchTraitors = async () => {
      // Step 1: Check user info
      const { data: userAccount, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", user.username)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      } else if (userAccount) {
        setUserAccount(userAccount);
        //navigate('/draft-winner');
      }
    };
    fetchTraitors();
  }, [user.username, navigate]);

  function handleSelect(id) {
    if (selectedTraitors.includes(id)) {
      setSelectedTraitors(
        selectedTraitors.filter((traitorId) => traitorId !== id)
      );
    } else {
      if (selectedTraitors.length < 4) {
        setSelectedTraitors([...selectedTraitors, id]);
      } else {
        setSelectedTraitors([selectedTraitors[1], selectedTraitors[2],selectedTraitors[3], id]);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {userAccount == {} ? null : (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-1/2">
            <Input
              type="text"
              placeholder="Create A Team Name"
              onChange={(e) => setTeamName(e.target.value)}
              className="text-black m-5 font-light"
            ></Input>
          </div>
          <div>
            <h3 className="font-light"> 🗡️ Select the 4 Players Drafted to Your Team 🗡️</h3>
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
          <SubmitButton
            selectedTraitors={selectedTraitors}
            teamName={teamName}
          ></SubmitButton>
        </div>
      )}
    </div>
  );
}

export default TraitorsLayout;
