import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";

// Import Data
import navdata from "../LayoutMenuData";
//i18n
import { withTranslation } from "react-i18next";
import withRouter from "../../Components/Common/withRouter";

const VerticalLayout = (props) => {
  const [locationSetup, setLocationSetup] = useState(false);
  const [setup, setSetup] = useState(false);
  const [params, setParams] = useState(false);

  const [product, setproduct] = useState(false);
  const [order, setOrder] = useState(false);
  const [category, setCategory] = useState(false);
  const [subs, setSubs] = useState(false);
  const [inquiry, setInquiry] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [cms, setCMS] = useState(false);

  const navData = navdata().props.children;
  const path = props.router.location.pathname;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const initMenu = () => {
      const pathName = process.env.PUBLIC_URL + path;
      const ul = document.getElementById("navbar-nav");
      const items = ul.getElementsByTagName("a");
      let itemsArray = [...items]; // converts NodeList to Array
      removeActivation(itemsArray);
      let matchingMenuItem = itemsArray.find((x) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    if (props.layoutType === "vertical") {
      initMenu();
    }
  }, [path, props.layoutType]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        if (
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
        ) {
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .classList.add("show");
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  const removeActivation = (items) => {
    let actiItems = items.filter((x) => x.classList.contains("active"));

    actiItems.forEach((item) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  };
  const [master, setMaster] = useState(false);

  return (
    <React.Fragment>
      {/* menu Items */}
      {/* <li className="menu-title">
        <span data-key="t-menu">Menu</span>
      </li> */}
      <Link
        className="nav-link menu-link d-none"
        to="#"
        data-bs-toggle="collapse"
        onClick={() => {
          setMaster(!master);
        }}
      >
        <span data-key="t-apps"></span>
      </Link>
      <li className="nav-item">
        <Link
          className="nav-link menu-link"
          to="#"
          data-bs-toggle="collapse"
          onClick={() => {
            setSetup(!setup);
          }}
        >
          <span data-key="t-apps"> Master </span>
        </Link>

        <Collapse className="menu-dropdown" isOpen={setup}>
          <ul className="nav nav-sm flex-column test">
            {/* <li className="nav-item">
              <Link to="/company-details" className="nav-link">
                Dashboard
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link to="/admin-user" className="nav-link">
                My preffered
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link to="/lab-report" className="nav-link">
                Lab Report
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link to="/admin-user" className="nav-link">
                Loyality Program
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/refferfriend" className="nav-link">
                Refer to Friend
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-admin" className="nav-link">
                Contact Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-pharmacy" className="nav-link">
                 Pharmacy Order Summery
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/second-opinion" className="nav-link">
                Appointment Request
              </Link>
            </li>
           
            <li className="nav-item">
              <Link to="/camping" className="nav-link">
                Camps
              </Link>
            </li>
          </ul>
        </Collapse>
         <li className="nav-item">
              <Link to="/PatientAppointment" className="nav-link">
                 Appointments
              </Link>
            </li>
         <li className="nav-item">
              <Link to="/Labcollection" className="nav-link">
                Lab Collection 
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/loyalty-points" className="nav-link">
                Add Hospital Bills 
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/service-orders" className="nav-link">
                Service Orders 
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/service-request" className="nav-link">
                Service Request 
              </Link>
            </li>
      </li>

      {/* <li className="nav-item">
        <Link
          className="nav-link menu-link"
          to="#"
          data-bs-toggle="collapse"
          onClick={() => {
            setParams(!params);
          }}
        >
          <span data-key="t-apps"> Parameters </span>
        </Link>

        <Collapse className="menu-dropdown" isOpen={params}>
          <ul className="nav nav-sm flex-column test">
            <li className="nav-item">
              <Link
                className="nav-link menu-link"
                to="#"
                data-bs-toggle="collapse"
                onClick={() => {
                  setCategory(!category);
                }}
              >
                <span data-key="t-apps"> Category Master</span>
              </Link>
              <Collapse className="menu-dropdown" isOpen={category}>
                <ul className="nav nav-sm flex-column test">
                  <li className="nav-item">
                    <Link className="nav-link menu-link" to="/category">
                      <span data-key="t-apps">Products Category </span>
                    </Link>
                  </li>
                </ul>
              </Collapse>
            </li>
          </ul>
        </Collapse>
      </li> */}

      <li className="nav-item">
        <Link
          className="nav-link menu-link"
          to="#"
          data-bs-toggle="collapse"
          onClick={() => {
            setproduct(!product);
          }}
        >
          <span data-key="t-apps"> Wallet </span>
        </Link>
        <Collapse
          className="menu-dropdown"
          isOpen={product}
          //   id="sidebarApps"
        >
          <ul className="nav nav-sm flex-column test">
          <li className="nav-item">
              <Link to="/Transactions" className="nav-link">
                Loyalty Point Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/refer-friend-transactions" className="nav-link">
                Refer a Friend Point Transactions
              </Link>
            </li>
          </ul>
        </Collapse>
      </li>

      {/* <li className="nav-item">
        <Link
          className="nav-link menu-link"
          to="#"
          data-bs-toggle="collapse"
          onClick={() => {
            setPolicy(!policy);
          }}
        >
          <span data-key="t-apps"> Policy and Promos</span>
        </Link>
        <Collapse className="menu-dropdown" isOpen={policy}>
          <ul className="nav nav-sm flex-column test"></ul>
          <ul className="nav nav-sm flex-column test">
            <li className="nav-item">
              <Link to="/promocode-master" className="nav-link">
                Promocode Master
              </Link>
            </li>
          </ul>
          <ul className="nav nav-sm flex-column test"></ul>
        </Collapse>
      </li> */}

      {/* <li className="nav-item">
        <Link
          className="nav-link menu-link"
          to="#"
          data-bs-toggle="collapse"
          onClick={() => {
            setCMS(!cms);
          }}
        >
          <span data-key="t-apps"> CMS </span>
        </Link>
        <Collapse
          className="menu-dropdown"
          isOpen={cms}
          //   id="sidebarApps"
        >
          <ul className="nav nav-sm flex-column test">
            <li className="nav-item">
              <Link className="nav-link menu-link" to="/blogs">
                <span data-key="t-apps">Blogs </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link" to="/contact">
                <span data-key="t-apps">Footer </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link" to="/newproject">
                <span data-key="t-apps">New Project </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link" to="/review">
                <span data-key="t-apps">User Review </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link" to="/banner">
                <span data-key="t-apps">Banner </span>
              </Link>
            </li>
          </ul>
        </Collapse>
      </li> */}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
