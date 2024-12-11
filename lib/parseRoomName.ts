import { RoomType } from "@prisma/client";
import { Rooms } from "@/definitions/constants";

export const parseRoomInfo = (roomType: RoomType) => {
  switch (roomType) {
    case "MEN60":
    case "MEN60WEEKEND":
      return {
        name: "남성룸[60분]",
        time: "60",
      };
    case "MEN90":
    case "MEN90WEEKEND":
      return {
        name: "남성룸[90분]",
        time: "90",
      };
    case "WOMEN60":
    case "WOMEN60WEEKEND":
      return {
        name: "여성룸[60분]",
        time: "60",
      };
    case "WOMEN90":
    case "WOMEN90WEEKEND":
      return {
        name: "여성룸[90분]",
        time: "90",
      };
    case "MEN_FAMILY":
    case "MEN_FAMILYWEEKEND":
      return {
        name: "남성+가족룸[100분]",
        time: "100",
      };
    case "WOMEN_FAMILY":
    case "WOMEN_FAMILYWEEKEND":
      return {
        name: "여성+가족룸[100분]",
        time: "100",
      };
    case "MIX":
    case "MIXWEEKEND":
      return {
        name: "혼성룸+대형사우나룸[100분]",
        time: "100",
      };
    default:
      return {
        name: roomType,
        time: "0",
      };
  }
};
