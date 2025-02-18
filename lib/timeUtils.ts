export const getRoomDuration = (roomType: string): number => {
  if (roomType.includes("FAMILY")) return 100;
  if (roomType.includes("90")) return 90;
  return 60;
};

export const calculateAdditionalFee = (
  persons: { men: number; women: number; children: number; infants: number },
  isFamily: boolean
): number => {
  let additionalFee = 0;
  const totalAdults = persons.men + persons.women;

  if (isFamily) {
    // Family room - charge from 3rd person
    if (totalAdults > 2) {
      additionalFee += (totalAdults - 2) * 35000;
    }
  } else {
    // Regular room - charge from 2nd person
    if (totalAdults > 1) {
      additionalFee += (totalAdults - 1) * 35000;
    }
  }

  // Add children fee
  additionalFee += persons.children * 20000;

  return additionalFee;
};
