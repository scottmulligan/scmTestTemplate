import { getBillboards } from "../api/queries/getBillboards";
import { BillboardResult } from "../interfaces/schema";
import Link from "next/link";
import { contentHubImageSrcGenerator } from "../utilities/contentHubImageLoader";
import defaultBillboard from "../public/billboard-frame.png";
import defaultBackground from "../public/background.jpg";
import defaultLogo from "../public/PLAY-Summit-long-light-grey.svg";
import Image from "next/image";
import { showDebugMessage } from "../utilities/debugger";
import { useRouter } from "next/router";
import { normalizeString } from "../utilities/helper";

type BillboardProps = {
  billboards: BillboardResult[];
};

const Home = (props: BillboardProps): JSX.Element => {
  showDebugMessage(props.billboards);
  const { asPath } = useRouter();

  const billboardList =
    props.billboards.length > 0 ? (
      <div className="billboard-list">
        {props.billboards.map((billboard, index) => (
          <div
            key={index}
            className="billboard-item"
            style={{
              backgroundImage:
                "url(" +
                contentHubImageSrcGenerator(billboard.advertisement_Image) +
                ")",
            }}
          >
            <Link
              href={`${asPath}${normalizeString(billboard.content_Name)}`}
              passHref
            >
              <a className="billboard-title">{billboard.content_Name}</a>
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <div className="billboard">
        <div className="image-container">
          <Image
            alt="background"
            src={defaultBackground}
            className="billboard-background"
            width={2000}
            height={1200}
            layout={"fixed"}
          />
          <div className="billboard-frame absolute bottom-0 z-40">
            <Image
              src={defaultBillboard}
              alt="the billboard"
              width={1000}
              height={900}
              layout={"fixed"}
            ></Image>
            <div className="billboard-container error">
              <div className="content">
                <div className="logo">
                  <Image src={defaultLogo} alt="logo" height={100} width={250} />
                </div>
                <div className="slogan">Something went wrong</div>
                <div className="body">
                  - Could not connect to Content Hub
                  <br />
                  - Could not find any billboard content
                  <br />
                  - The internet is down
                  <br />
                  - Your computer is not on
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return billboardList;
};

export const getStaticProps = async () => {
  const { billboards } = await getBillboards();
  return {
    props: {
      billboards: billboards,
    },
    revalidate: 10,
  };
};

export default Home;
