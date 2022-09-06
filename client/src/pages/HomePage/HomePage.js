import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import img1 from "../../images/crying-woman.jpg";
import img2 from "../../images/smily-woman.jpg";
import img3 from "../../images/monster.jpg";
import img4 from "../../images/selfie.jpg";
import "animate.css";

const HomePage = () => {
  
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <>
      <section className="intro">
        <h1 className="intro-h1 animate__animated animate__rotateIn">
          <span className="intro-c">C</span>
          <span className="intro-r">r</span>
          <span className="intro-a">a</span>
          <span className="intro-z">z</span>
          <span className="intro-y">y </span>
          <span className="">Picasso</span>
        </h1>
        <div className="intro-images">
          <div className="img1 animate__animated animate__backInLeft animate__delay-1s">
            <img src={img1} width="200" height="250" />
          </div>
          <div className="img2 animate__animated animate__backInDown animate__delay-1s">
            <img src={img2} width="200" height="250" />
          </div>
          <div className="img3 animate__animated animate__backInUp animate__delay-1s">
            <img src={img3} width="200" height="250" />
          </div>
          <div className="img4 animate__animated animate__backInRight animate__delay-1s">
            <img src={img4} width="200" height="250" />
          </div>
        </div>

        <div className="intro-buttons">
          <button
            className="button animate__animated animate__lightSpeedInLeft animate__delay-2s"
            id="signup"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <button
            className="button animate__animated animate__lightSpeedInRight animate__delay-2s"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
