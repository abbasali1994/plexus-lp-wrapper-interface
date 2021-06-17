import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { constants } from "../../utils";
import "./index.css";

export default function SkeletonWrapper({ images, children }) {
  const [loading, setloading] = useState(images.length);
  const [fontsLoading, setFontsloading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    document.fonts.ready.then(function () {
      setFontsloading(false);
    });
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
        <div hidden>
          {images.map((src, index) => {
            return (
              <img
                key={index}
                src={src}
                alt={"img"}
                onLoad={() => setloading(loading - 1)}
              />
            );
          })}
        </div>
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
