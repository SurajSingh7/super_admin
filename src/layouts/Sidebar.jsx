import React, { useState, useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import { DashboardOutlined, HomeOutlined, UserOutlined, SettingOutlined,FormOutlined } from "@ant-design/icons";
import { checkPermission } from "@/utils/checkPermission";
import Link from "next/link";

const { Sider } = Layout;

const Sidebar = ({ status, func }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(["companymaster"]); // Track selected key

  useEffect(() => {
    const fetchPermissions = async () => {
      const permissions = await checkPermission();
      setMenuItems(permissions);
    };

    fetchPermissions();
  }, []);

  const icons = [
    <HomeOutlined key="home" />,
    <UserOutlined key="user" />,
    <SettingOutlined key="settings" />,
    <DashboardOutlined key="dashboard" />,
    <FormOutlined key="companymaster" />
  ];

  console.log("menuIteam->####################", menuItems);

  const menuItemsData = [
    {
      key: "companymaster",
      icon: <FormOutlined style={{ color: selectedKeys.includes("companymaster") ? "black" : "white" }} />, // Change icon color
      label: (
        <Link
          href="/super-admin/company-master"
          style={{
            textDecoration: "none",
            color: selectedKeys.includes("companymaster") ? "gray" : "white", // Change text color
          }}
        >
          CreateCompany
        </Link>
      ),
    }
    ,
    {
      key: "dashboard",
      icon: <DashboardOutlined style={{ color: selectedKeys.includes("dashboard") ? "black" : "white" }} />, // Change icon color
      label: (
        <Link
          href="/employee/dashboard"
          style={{
            textDecoration: "none",
            color: selectedKeys.includes("dashboard") ? "gray" : "white", // Change text color
          }}
        >
          employee
        </Link>
      ),
    },
    ...(menuItems && Array.isArray(menuItems)
      ? menuItems.map((item, index) => ({
          key: item._id,
          icon: React.cloneElement(icons[index % icons.length], {
            style: { color: selectedKeys.includes(item._id) ? "black" : "white" },
          }), // Change icon color dynamically
          label: (
            <Link
              href={item.resources}
              style={{
                textDecoration: "none",
                color: selectedKeys.includes(item._id) ? "gray" : "white", // Change text color dynamically
              }}
            >
              {item.menuName}
            </Link>
          ),
        }))
      : []),
  ];

  return (
    <Layout style={{ padding: "auto", paddingBottom: "30px" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={status}
        style={{ overflow: "auto", position: "fixed", left: 0, height: "100%", zIndex: 555, top: 40 }}
        width={150} // final width
        collapsedWidth={72} // initial width
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys} // Track selected key
          onClick={(e) => setSelectedKeys([e.key])} // Update selected key dynamically
          style={{ background: "#36454f", height: "100%", color: "white" }}
          items={menuItemsData}
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;




