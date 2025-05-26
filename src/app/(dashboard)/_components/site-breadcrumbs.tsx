"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatSegment } from "@/lib/segments";
import { cn } from "@/lib/utils";

const SiteBreadcrumbs = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className={cn(pathname === "/" && "text-base-content font-medium")}
          >
            <Link href="/">Panel Principal</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && <BreadcrumbSeparator />}
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          const fullPathKey = pathSegments.slice(0, index + 1).join("/");
          const formattedSegment = formatSegment(segment, fullPathKey);

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={cn("capitalize")}>
                    {formattedSegment}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={path}>{formattedSegment}</Link>
                    </BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>
              {pathSegments.length !== index + 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SiteBreadcrumbs;
