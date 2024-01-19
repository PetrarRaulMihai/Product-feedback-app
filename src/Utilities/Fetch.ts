import supabase from "../configSupa/supabaseConfiguration";
import { TABLE_NAME } from "./CommonVariables";

export const fetchData = async () => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select()
    .eq("id", "90813cf7-fdee-4f10-aef5-ce2c1950c9c3");
  console.error(error);

  return data;
};

export default fetchData;
