"use client";

import { UserService } from "@/src/services";
import { useEffect } from "react";

const PlaygroundComponent = (props: { data?: any }) => {
  const { data = "{}" } = props;
  const test = async () => {
    try {
      const user = await UserService.getUser();
      console.log('PlaygroundComponent test', user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    test();
  }, []);

  console.log("data", JSON.parse(data));

  return <div>PlaygroundComponent</div>;
};
export default PlaygroundComponent;
