export function getRoomDuration(roomType: string): number {
  // MIX rooms have 100min sessions regardless of naming
  if (roomType.includes("MIX")) return 100;
  // Handle 90/60 minute rooms
  return roomType.includes("90") ? 90 : 60;
}

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

export const checkTimeOverlap = (
  start1: number,
  duration1: number,
  start2: number,
  duration2: number
): boolean => {
  const end1 = start1 + duration1;
  const end2 = start2 + duration2;
  return start1 < end2 && end1 > start2;
};
