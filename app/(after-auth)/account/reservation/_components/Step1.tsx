import React from "react";

const Step1 = ({
  handlePeople,
}: {
  handlePeople: (people: {
    children: number;
    infants: number;
    men: number;
    women: number;
  }) => void;
}) => {
  return <div>Step1</div>;
};

export default Step1;
