import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import clsx from "clsx";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const PATHS = [
    {
      key: "global",
      path: "/",
    },
    {
      key: "personal",
      path: "/personal",
    },
  ];

  return (
    <div className="header-menu flex justify-center border-solid border-b h-16">
      {PATHS.map((path) => {
        const active = location.pathname === path.path;
        console.log(location.pathname, path.path);
        return (
          <Link
            key={path.key}
            to={path.path}
            className={clsx({
              active,
            })}
          >
            {t(path.key)}
          </Link>
        );
      })}
    </div>
  );
};

export default Header;
