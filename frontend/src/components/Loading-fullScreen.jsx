import React from "react";
import styled from "styled-components";
// 要引用的樣式
import { PuffLoader, ClipLoader } from "react-spinners";

// 全版的半透明背景
const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Loading() {
  return (
    <LoadingWrapper>
      <div>加載中</div>
      <PuffLoader size={60} color={"#4A90E2"} />
      <ClipLoader size={60} color={"#4A90E2"} />
    </LoadingWrapper>
  );
}
