import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import brokenIcons from "@/icons/broken";
import StickyStyles from "@/components/stickyStyles";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { MoonDuotone, SearchLinear, SunDuotone } from "@/icons/component";
import boldDuotoneIcons from "@/icons/bold-duotone";
import boldIcons from "@/icons/bold";
import outlineIcons from "@/icons/outline";
import linearIcons from "@/icons/linear";
import lineDuotoneIcons from "@/icons/line-duotone";

function svgToReact(code: string, name: string, tabName: string) {
  let result: any = code;
  result = result.split("\n").join("\n          ");
  result = result
    .replaceAll("-w", "W")
    .replaceAll("-l", "L")
    .replaceAll("-r", "R");
  result = result.replaceAll(
    "  </svg>",
    `</svg>
    )
}`
  );
  result = result.replaceAll(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    `export const ${name[0].toUpperCase() + name.slice(1)}${tabName} = (props: SVGAttributes<SVGElement>) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >`
  );
  return result.trim();
}

function Icon({
  icon,
  iconName,
  tabName,
}: {
  icon: any;
  iconName: string;
  tabName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [svgCopied, setSvgCopied] = useState(false);
  const [reactCopied, setReactCopied] = useState(false);
  return (
    <Popover
      showArrow={true}
      placement="top"
      isOpen={isOpen}
      onOpenChange={(a) => {
        a === false ? setIsOpen(false) : void 0;
      }}
    >
      <PopoverTrigger>
        <span className="relative block float-left">
          <Tooltip content={cammelCaseToTitleCase(iconName)} showArrow={true}>
            <Button
              isIconOnly={true}
              id={iconName}
              onPress={() => {
                setIsOpen(!isOpen);
              }}
              key={iconName}
              className="float-left *:active:scale-75 flex gap-2 bg-[rgba(0,0,0,.02)] dark:bg-[rgba(255,255,255,.03)] justify-center flex-col items-center overflow-hidden mb-1 mr-1 size-16 rounded-lg max-w-16 max-h-16 p-2"
            >
              <div
                data-icon={iconName}
                className="transition-all dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: icon.replaceAll(
                    `width="24" height="24"`,
                    `width="32" height="32"`
                  ),
                }}
              ></div>
            </Button>
          </Tooltip>
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <h1 className="text-3xl text-center tracking-tighter font-bold">
            {cammelCaseToTitleCase(iconName)}
          </h1>
          <div className="flex flex-col gap-1 mt-3">
            <Button
              variant="solid"
              color="warning"
              onPress={() => {
                navigator.clipboard.writeText(icon);
                setSvgCopied(true);
                setTimeout(() => {
                  setSvgCopied(false);
                }, 1500);
              }}
            >
              {svgCopied ? "Copied!" : "Copy SVG Code"}
            </Button>
            <Button
              variant="ghost"
              color="primary"
              onPress={() => {
                navigator.clipboard.writeText(
                  svgToReact(icon, iconName, tabName)
                );
                setReactCopied(true);
                setTimeout(() => {
                  setReactCopied(false);
                }, 1500);
              }}
            >
              {reactCopied ? "Copied!" : "Copy React Component"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function cammelCaseToTitleCase(str: string) {
  const result = str
    .replace(/([A-Z])/g, " $1")
    .replace(/([0-9]+)/g, " $1")
    .trim();
  return (
    result.charAt(0).toUpperCase() +
    (result.slice(1) as any).replaceAll(",", ", ")
  );
}
function normalize(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/([0-9]+)/g, " $1")
    .toLowerCase()
    .trim();
}

export default function IndexPage() {
  const [page, setPage] = useState("broken");
  const [icons, setIcons] = useState({});
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">();

  const tabNames = {
    broken: "Broken",
    lineDuotone: "LineDuotone",
    linear: "Linear",
    outline: "Outline",
    bold: "Bold",
    boldDuotone: "Duotone",
  };

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme") as "dark" | "light");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    switch (page) {
      case "broken":
        setIcons(brokenIcons);
        break;
      case "line-duotone":
        setIcons(lineDuotoneIcons);
        break;
      case "linear":
        setIcons(linearIcons);
        break;
      case "outline":
        setIcons(outlineIcons);
        break;
      case "bold":
        setIcons(boldIcons);
        break;
      case "bold-duotone":
        setIcons(boldDuotoneIcons);
        break;
      default:
        setIcons(boldDuotoneIcons);
        break;
    }
  }, [page]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
    if (!theme) return;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-200 to-orange-100 w-full text-center flex gap-1 items-center justify-center dark:from-yellow-900/25 dark:to-orange-900/25 p-4">
        🚧 Work in progress 🚧
      </div>
      <div className="p-12">
        <div className="firefox-blur bg-orange-500 z-30 w-24 h-[500px] blur-[300px] pointer-events-none top-12 -rotate-45 left-24 fixed " />
        <div className="firefox-blur bg-pink-500 z-30 size-72 blur-[500px] pointer-events-none top-12 right-24 fixed " />
        <div className="flex mb-4">
          <div className="flex-col flex">
            <h1 className="text-7xl font-bold tracking-tighter">
              HeroUI{" "}
              <span className="bg-gradient-to-r dark:from-purple-300 from-purple-800 to-pink-800 dark:to-pink-300 bg-clip-text text-transparent">
                Icons
              </span>
            </h1>
          </div>
        </div>
        <StickyStyles
          fixedClass="transition-all sticky flex top-0 z-20 w-full pt-2"
          staticClass="transition-all sticky flex top-0 z-20"
        >
          <Tabs
            selectedKey={page}
            onSelectionChange={(key: any) => setPage(key)}
          >
            <Tab key="broken" value="broken" title="Broken" />
            <Tab key="line-duotone" value="line-duotone" title="Line Duotone" />
            <Tab key="linear" value="linear" title="Linear" />
            <Tab key="outline" value="outline" title="Outline" />
            <Tab key="bold" value="bold" title="Bold" />
            <Tab key="bold-duotone" value="bold-duotone" title="Bold Duotone" />
          </Tabs>
          <div className="ml-auto flex gap-1">
            <Button
              isIconOnly
              onPress={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              {theme === "dark" ? (
                <SunDuotone className="scale-110" />
              ) : theme === "light" ? (
                <MoonDuotone className="scale-110" />
              ) : (
                ""
              )}
            </Button>
          </div>
        </StickyStyles>
        <Input
          value={search}
          onValueChange={(value: any) => setSearch(value)}
          placeholder="Search icons..."
          startContent={<SearchLinear />}
          className="mt-2 w-[32%] mb-1"
        />
        <div
          className={
            search.length < 1 ? "icon-grid flex flex-col" : "icon-grid"
          }
        >
          {Object.keys(icons).map((category) => {
            return (
              <div
                key={category}
                className={search.length < 1 ? "w-full" : "w-fit float-left"}
              >
                {search.length < 1 && (
                  <h2 className="uppercase text-sm mb-1 font-bold opacity-75 mt-4">
                    {cammelCaseToTitleCase(category)}
                  </h2>
                )}
                {Object.keys((icons as any)[category])
                  .filter((a) => {
                    const title = normalize(cammelCaseToTitleCase(a));
                    const query = normalize(search);
                    return (
                      title.includes(query) ||
                      a
                        .toLowerCase()
                        .includes(
                          (query as any).replaceAll(" ", "").toLowerCase()
                        )
                    );
                  })
                  .map((iconName) => {
                    const icon = (icons as any)[category][iconName];
                    return (
                      <Icon
                        key={iconName}
                        icon={icon}
                        iconName={iconName}
                        tabName={tabNames[page]}
                      />
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
