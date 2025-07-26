import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import StickyStyles from "@/components/stickyStyles";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import {
  MoonDuotone,
  SearchLinear,
  StickerSquareBold,
  StickerSquareBroken,
  StickerSquareDuotone,
  StickerSquareLinear,
  StickerSquareLineDuotone,
  StickerSquareOutline,
  SunDuotone,
} from "@/icons/component";

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
function sanitizeReactIconName(input: string): string {
  let cleaned = input.replace(/[^a-zA-Z0-9]/g, "");
  cleaned = cleaned.replace(/^[0-9]+/, "");
  if (cleaned.length === 0) return "";
  return cleaned[0].toUpperCase() + cleaned.slice(1);
}

function Icon({
  iconFunction,
  iconName,
  tabName,
}: {
  iconFunction: any;
  iconName: string;
  tabName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [svgCopied, setSvgCopied] = useState(false);
  const [reactCopied, setReactCopied] = useState(false);
  const [icon, setIcon] = useState("");
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!iconRef.current) return;
    if (!hasLoaded) {
      setIcon("");
    }

    const observer = new IntersectionObserver(
      async (entries, obs) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setHasLoaded(true);
            const svg = await iconFunction();
            setIcon(svg.replaceAll("black", "currentColor"));
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(iconRef.current);

    return () => {
      if (iconRef.current) observer.unobserve(iconRef.current);
    };
  }, [iconFunction, hasLoaded, tabName]);

  useEffect(() => {
    setHasLoaded(false);
  }, [tabName]);

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
        <span ref={iconRef} className="relative block float-left">
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
        <div className="p-2 py-4 relative">
          <h1 className="text-3xl text-center tracking-tighter font-bold">
            {cammelCaseToTitleCase(iconName)}
          </h1>
          <div className="flex flex-col gap-1 mt-3 min-w-72">
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
                  svgToReact(icon, sanitizeReactIconName(iconName), tabName)
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
const allSvgs = import.meta.glob("/src/icons/svg/*/*/*.svg", {
  as: "raw",
});

export function getIcons(page: string) {
  const data: Record<string, Record<string, () => Promise<string>>> = {};

  for (const path in allSvgs) {
    if (!path.includes(`/src/icons/svg/${page}/`)) continue;

    const parts = path.split("/");
    const category = parts[parts.length - 2];
    const iconName = parts[parts.length - 1].replace(".svg", "");

    if (!data[category]) {
      data[category] = {};
    }

    data[category][iconName] = allSvgs[path]; // guarda la función sin ejecutarla
  }

  return data;
}

export default function IndexPage() {
  const [page, setPage] = useState("bold-duotone");
  const [icons, setIcons] = useState({});
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">();

  const tabNames = {
    broken: "Broken",
    "line-duotone": "LineDuotone",
    linear: "Linear",
    outline: "Outline",
    bold: "Bold",
    "bold-duotone": "Duotone",
  };

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme") as "dark" | "light");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    async function load() {
      switch (page) {
        case "broken":
          setIcons(await getIcons("Broken"));
          break;
        case "line-duotone":
          setIcons(await getIcons("Line Duotone"));
          break;
        case "linear":
          setIcons(await getIcons("Linear"));
          break;
        case "outline":
          setIcons(await getIcons("Outline"));
          break;
        case "bold":
          setIcons(await getIcons("Bold"));
          break;
        case "bold-duotone":
          setIcons(await getIcons("Bold Duotone"));
          break;
        default:
          setIcons(await getIcons("Linear"));
          break;
      }
    }
    load();
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
            <Tab
              key="broken"
              value="broken"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareBroken />
                  <span>Broken</span>
                </span>
              }
            />
            <Tab
              key="line-duotone"
              value="line-duotone"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareLineDuotone />
                  <span>Line Duotone</span>
                </span>
              }
            />
            <Tab
              key="linear"
              value="linear"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareLinear />
                  <span>Linear</span>
                </span>
              }
            />
            <Tab
              key="outline"
              value="outline"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareOutline />
                  <span>Outline</span>
                </span>
              }
            />
            <Tab
              key="bold"
              value="bold"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareBold />
                  <span>Bold</span>
                </span>
              }
            />
            <Tab
              key="bold-duotone"
              value="bold-duotone"
              title={
                <span className="flex gap-1 items-center">
                  <StickerSquareDuotone />
                  <span>Bold Duotone</span>
                </span>
              }
            />
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
                        iconFunction={icon}
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
