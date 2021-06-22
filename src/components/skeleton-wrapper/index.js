import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { constants } from "../../utils";
import { assets } from "../../utils/images";
import "./index.css";

export default function SkeletonWrapper({ checks, children }) {
  let images = [];
  checks.map((key) => {
    images = [...images, ...assets[key]];
    return 0;
  });
  const [loading, setloading] = useState(images.length);
  const [fontsLoading, setFontsloading] = useState(!document.fonts.load("22px 'Azo Sans Regular'"));
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    document.fonts.onloadingdone = (font) => {
      setFontsloading(false);
    };
    window.addEventListener("resize", handleResize);
  });

  let wrapper =
    width > constants.width.mobile ? (
      <DesktopSkeletonContent />
    ) : (
      <MobileSkeletonContent />
    );
  return (
    <>
      {loading > 0 || fontsLoading ? wrapper : children}
      {
        <>
          <div hidden>
            {images.map((src, index) => {
              return (
                <img
                  key={index}
                  src={src.image.default}
                  alt={"img"}
                  onLoad={() => setloading(loading - 1)}
                />
              );
            })}
          </div>
          <div hidden={!fontsLoading} className="font-skeleton">
            <i style={{ fontFamily: "Codeink Regular" }}>.</i>
            <i style={{ fontFamily: "Nova Mono Regular" }}>.</i>
            <i style={{ fontFamily: "Codeink italic" }}>.</i>
            <i style={{ fontFamily: "Azo Sans Regular" }}>.</i>
            <i style={{ fontFamily: "Azo Sans Bold" }}>.</i>
          </div>
        </>
      }
    </>
  );
}

function DesktopSkeletonContent() {
  return (
    <SkeletonTheme color="#060818" highlightColor="#191E3A">
      <Row>
        <Col lg={3} className="desktop-sidebar-skeleton">
          <Skeleton height={40} width={"100%"} count={3} />
          <Row style={{ marginTop: "15%" }}>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "15%" }}>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "5%", marginBottom: "15%" }}>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>

          <Skeleton height={30} width={"100%"} count={2} />
        </Col>
        <Col className="desktop-main-skeleton" lg={9}>
          <Skeleton height={40} width={"100%"} />
          <Row style={{ marginTop: "5%" }}>
            <Col lg={3}>
              <Skeleton height={100} />
            </Col>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "5%" }}>
            <Col lg={3}>
              <Skeleton height={100} />
            </Col>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "5%", marginBottom: "5%" }}>
            <Col lg={3}>
              <Skeleton height={100} />
            </Col>
            <Col lg={9}>
              <Skeleton height={100} />
            </Col>
          </Row>

          <Skeleton height={30} width={"100%"} count={3} />
        </Col>
      </Row>
    </SkeletonTheme>
  );
}

function MobileSkeletonContent() {
  return (
    <SkeletonTheme color="#060818" highlightColor="#191E3A">
      <Row>
        <Col className="mobile-main-skeleton" lg={12}>
          <Skeleton height={40} width={"100%"} />
          <Row style={{ marginTop: "5%" }}>
            <Col>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "5%" }}>
            <Col>
              <Skeleton height={100} />
            </Col>
          </Row>
          <Row style={{ marginTop: "5%", marginBottom: "5%" }}>
            <Col>
              <Skeleton height={100} />
            </Col>
          </Row>

          <Skeleton height={30} width={"100%"} count={1} />
        </Col>
        <Col className="mobile-sidebar-skeleton" lg={12}>
          <Skeleton height={30} width={"100%"} count={1} />
        </Col>
      </Row>
    </SkeletonTheme>
  );
}
