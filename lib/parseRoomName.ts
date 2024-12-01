import { Rooms } from "@/definitions/constants";

export const parseRoomInfo = (roomName: keyof typeof Rooms) => {
  switch (roomName) {
    case "MEN60":
      return {
        name: "남성룸",
        time: "60",
      };
    case "MEN90":
      return {
        name: "남성룸",
        time: "90",
      };
    case "WOMEN60":
      return {
        name: "여성룸",
        time: "60",
      };
    case "WOMEN90":
      return {
        name: "여성룸",
        time: "90",
      };
    case "FAMILY100":
      return {
        name: "가족룸",
        time: "100",
      };
    case "FAMILY100WEEKEND":
      return {
        name: "가족룸 (주말)",
        time: "100",
      };
    default:
      return {
        name: "",
        time: "",
      };
  }
};
