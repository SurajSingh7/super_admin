import React, { useState, useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import { 
  DashboardOutlined, 
  HomeOutlined, 
  UserOutlined, 
  SettingOutlined,
  FormOutlined,
  FileTextOutlined,
  ClockCircleOutlined 
} from "@ant-design/icons";
import { checkPermission } from "@/utils/checkPermission";
import Link from "next/link";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ status, func }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(["companymaster"]);
  const [openKeys, setOpenKeys] = useState([]); // For tracking open submenus

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
    <FormOutlined key="companymaster" />,
    <FileTextOutlined key="logs" />,
    <ClockCircleOutlined key="attendance" />
  ];

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const menuItemsData = [
    {
      key: "companymaster",
      icon: <FormOutlined style={{ color: selectedKeys.includes("companymaster") ? "black" : "white" }} />,
      label: (
        <Link
          href="/super-admin/company-master"
          style={{
            textDecoration: "none",
            color: selectedKeys.includes("companymaster") ? "gray" : "white",
          }}
        >
          Create Company
        </Link>
      ),
    },
    {
      key: "dashboard",
      icon: <DashboardOutlined style={{ color: selectedKeys.includes("dashboard") ? "black" : "white" }} />,
      label: (
        <Link
          href="/employee/dashboard"
          style={{
            textDecoration: "none",
            color: selectedKeys.includes("dashboard") ? "gray" : "white",
          }}
        >
          employee
        </Link>
      ),
    },
    {
      key: "logs",
      icon: <FileTextOutlined style={{ color: selectedKeys.includes("logs") || openKeys.includes("logs") ? "black" : "white" }} />,
      label: "Logs",
      children: [
        {
          key: "attendance-logs",
          icon: <ClockCircleOutlined style={{ color: selectedKeys.includes("attendance-logs") ? "black" : "gray" }} />,
          label: (
            <Link
              className="text-black"
              href="/activityLogs/attendance/viewAllActivityLogs/"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: selectedKeys.includes("attendance-logs") ? "black" : "gray",
              }}
            >
              Attendance Activity
            </Link>
          ),
        },
      ],
    },
    // Dynamic permissions items
    ...(menuItems && Array.isArray(menuItems) ? 
      menuItems.map((item, index) => ({
        key: item._id,
        icon: React.cloneElement(icons[index % icons.length], {
          style: { color: selectedKeys.includes(item._id) ? "black" : "white" },
        }),
        label: (
          <Link
            href={item.resources}
            style={{
              textDecoration: "none",
              color: selectedKeys.includes(item._id) ? "gray" : "white",
            }}
          >
            {item.menuName}
          </Link>
        ),
      })) 
      : [])
  ];

  return (
    <Layout style={{ padding: "auto", paddingBottom: "30px" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={status}
        style={{ overflow: "auto", position: "fixed", left: 0, height: "100%", zIndex: 555, top: 40 }}
        width={150}
        collapsedWidth={72}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={(e) => setSelectedKeys([e.key])}
          style={{ background: "#36454f", height: "100%", color: "white" }}
          items={menuItemsData}
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;