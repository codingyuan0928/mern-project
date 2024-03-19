import React from "react";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ParentContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 200px;
`;

export default function Loading() {
  return (
    <ParentContainer>
      <LoadingWrapper>
        <ClipLoader size={60} color={"#4A90E2"} />
      </LoadingWrapper>
    </ParentContainer>
  );
}
