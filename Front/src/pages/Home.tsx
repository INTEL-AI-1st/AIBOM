import { Outlet } from "react-router-dom";
import { HomeWrapper, OutletWrapper } from "@styles/HomeStyles";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

export default function Home() {

  return (
    <HomeWrapper>
      <Header/>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
      <Footer/>
    </HomeWrapper>
  );
}
