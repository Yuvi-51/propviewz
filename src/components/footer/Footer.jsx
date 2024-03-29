import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";
import TopLocations from "../top-project-and-location/TopLocations";
import TopProjects from "../top-project-and-location/TopProjects";
import "./Footer.scss";

export default async function Footer() {
  return (
    <footer className="footer-div">
      <div className="footer">
        <div className="col-md-4 f-header">
          <h1 className="c-name">
            Propeye Technologies <small className="sm-name">Pvt.Ltd.</small>
          </h1>
          <h2 className="c-details">
            A platform for real estate validation based on reviews, where users
            may post, read reviews and get actual selling prices of the
            Properties before purchasing.{" "}
          </h2>
          <div className="icon-container">
            <div className="icon-header">Follow Us :</div>
            <div className="footer-icons">
              <Link
                href="https://www.facebook.com/propviewz/?modal=admin_todo_tour"
                target="_blank"
              >
                <Image
                  src="/images/Facebook Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt="Facebook-icon"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/company/68974999/"
                target="_blank"
              >
                <Image
                  src="/images/Linkedin Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
              <Link href="https://www.instagram.com/propviewz/" target="_blank">
                <Image
                  src="/images/Instagram Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
              <Link href="https://twitter.com/propviewz" target="_blank">
                <Image
                  src="/images/Twitter Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <h3>QUICK LINKS</h3>
          <Link href="/" className="text">
            Home
          </Link>
          <Link href={"/blog"} className="text">
            Our Blogs
          </Link>
          <h3>USEFUL LINKS</h3>
          <Link href="/about-us" className="text">
            About Us
          </Link>
          <Link href="/privacy-policy" className="text">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="text">
            Terms of Use{" "}
          </Link>
          <Link href="/refund-and-cancellation" className="text">
            Refund & Cancellation{" "}
          </Link>

          <Link href="/contact-us" className="text">
            Contact Us
          </Link>
        </div>
        <TopLocations />
        <TopProjects />
        <div className="col-md-4 f-header-down">
          <h1 className="c-name">
            Propeye Technologies <small className="sm-name">Pvt.Ltd.</small>
          </h1>
          <h2 className="c-details">
            A platform for real estate validation based on reviews, where users
            may post, read reviews and get actual selling prices of the
            Properties before purchasing.{" "}
          </h2>
          <div className="icon-container">
            <div className="icon-header">Follow Us :</div>
            <div className="footer-icons">
              <Link
                href="https://www.facebook.com/propviewz/?modal=admin_todo_tour"
                target="_blank"
              >
                <Image
                  src="/images/Facebook Fill.svg"
                  width={25}
                  height={25}
                  alt="Facebook-icon"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/company/68974999/"
                target="_blank"
              >
                <Image
                  src="/images/Linkedin Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
              <Link href="https://www.instagram.com/propviewz/" target="_blank">
                <Image
                  src="/images/Instagram Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
              <Link href="https://twitter.com/propviewz" target="_blank">
                <Image
                  src="/images/Twitter Fill.svg"
                  aria-hidden="true"
                  width={25}
                  height={25}
                  alt=""
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-para">
        <p>© Copyright 2022 Propeye Technologies. All Rights reserved.</p>
      </div>
    </footer>
  );
}
