"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getClaimedProjectsAPI } from "@/connections/get-requests/getClaimedProjectsAPI";
import {
  myOrderOptions,
  userActivityOptions,
} from "@/constants/userDrawerOptions";
import useAsync from "@/custom/useAsync";
import { removeToken } from "@/store/slices/authSlice";
import {
  CreditCard,
  FileText,
  FolderKanbanIcon,
  LogOutIcon,
  Tags,
  User2Icon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "../ui/use-toast";
import AccordionWrapper from "../wrappers/AccordianWrapper";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./UserDrawer.scss";
import { getUserDetailsAPI } from "@/connections/get-requests/getUserDetailsAPI";

export default function UserDrawer({ triggerElement }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const type = searchParams.get("type");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [request, setRequest] = useState(false);

  // const { user } = useSelector((store) => store.user);
  const router = useRouter();
  const {
    loading,
    error,
    value: claimedProject,
  } = useAsync(getClaimedProjectsAPI, [], ["1", token, request]);

  const { value: userProfileData } = useAsync(getUserDetailsAPI, [], [token]);

  return (
    <Sheet>
      {token ? (
        <SheetTrigger asChild>
          {triggerElement ? (
            triggerElement
          ) : (
            <span className="u-icon-inner">
              {userProfileData?.first_name[0].toUpperCase()}
            </span>
          )}
        </SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          {triggerElement ? (
            triggerElement
          ) : (
            <User2Icon className="u-icon-inner" />
          )}
        </SheetTrigger>
      )}
      <SheetContent>
        <ScrollArea className="h-[99vh]">
          <div className="profile-dropdown">
            <SheetHeader>
              {token ? (
                <>
                  <SheetTitle>{`${userProfileData?.first_name} ${userProfileData?.last_name}`}</SheetTitle>
                  <SheetDescription></SheetDescription>
                </>
              ) : (
                <ProtectedRouteWrapper
                  triggerElement={
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        // gap: "20px",
                        alignItems: "center",
                        width: "200px",
                        margin: "10px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-circle-user-round"
                      >
                        <path d="M18 20a6 6 0 0 0-12 0" />
                        <circle cx="12" cy="10" r="4" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <Button
                        style={{
                          height: "10px",
                          width: "150px",
                          marginLeft: "10px",
                        }}
                      >
                        Login
                      </Button>
                    </div>
                  }
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-user-round"
                    >
                      <path d="M18 20a6 6 0 0 0-12 0" />
                      <circle cx="12" cy="10" r="4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <Button
                      style={{
                        height: "10px",
                        width: "150px",
                        marginLeft: "10px",
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </ProtectedRouteWrapper>
              )}
            </SheetHeader>
            {token ? (
              <div className="email-phone-details">
                <p className="p-email"> {userProfileData?.email}</p>
                <p className="p-email"> {userProfileData?.phone}</p>
              </div>
            ) : (
              " "
            )}
            <p className="p-hr-line"></p>
            <AccordionWrapper
              triggerElement={
                <p>
                  <span>
                    <FileText />
                  </span>
                  <span>Activity</span>
                </p>
              }
              isOpen={true}
            >
              <div className="activity-grid">
                {userActivityOptions?.map((el, i) => (
                  <ProtectedRouteWrapper
                    key={i}
                    triggerElement={
                      <p>
                        <div
                          className={`${
                            tab === el?.activityOption
                              ? "border-[#f1592a]"
                              : null
                          }`}
                        >
                          <span>{el.icon}</span>
                          <p>{el.text}</p>
                        </div>
                      </p>
                    }
                    callback={() => router.push(el?.slug)}
                  >
                    <Link key={i} href={el?.slug}>
                      <div
                        className={`${
                          tab === el?.activityOption ? "border-[#f1592a]" : null
                        }`}
                      >
                        <span>{el.icon}</span>
                        <p>{el.text}</p>
                      </div>
                    </Link>
                  </ProtectedRouteWrapper>
                ))}
              </div>
            </AccordionWrapper>
            {/* Offers Received */}
            <div
              className={userProfileData?.is_claimed === true ? "" : "hidden"}
            >
              <ProtectedRouteWrapper
                triggerElement={
                  <a className="dropdown-hover">
                    <span>
                      <Tags />
                    </span>
                    <span>Offers Received</span>
                  </a>
                }
                callback={() => router.push(`/offers-received`)}
              >
                <a href={`/offers-received`} className="dropdown-hover">
                  <span>
                    <Tags />
                  </span>
                  <span>Offers Received</span>
                </a>
              </ProtectedRouteWrapper>
            </div>
            {/* Offers Sent */}
            <ProtectedRouteWrapper
              triggerElement={
                <p className="dropdown-hover">
                  <span>
                    <Tags />
                  </span>
                  <span>Offers Sent</span>
                </p>
              }
              callback={() => router.push(`/offers-sent`)}
            >
              <a href={`/offers-sent`} className="dropdown-hover">
                <span>
                  <Tags />
                </span>
                <span>Offers Sent</span>
              </a>
            </ProtectedRouteWrapper>

            {/* INFO: My Projects Section */}
            <div onClick={() => setRequest(true)}>
              <AccordionWrapper
                triggerElement={
                  <p>
                    <span>
                      <FolderKanbanIcon />
                    </span>
                    <span>My Projects</span>
                  </p>
                }
              >
                {/* TODO: Need to remove this index as key with unique id */}
                {claimedProject?.map((el, i) => (
                  <Link
                    href={`/${el?.city_id === 2209 ? "pune" : "mumbai"}/${
                      el?.location_slug
                    }/${el.slug}`}
                    key={i}
                  >
                    <p
                      className="dropdown-hover"
                      style={{ marginLeft: "45px", padding: "5px 10px" }}
                    >
                      <p>{`${i + 1}. ${el.name}`}</p>
                    </p>
                  </Link>
                ))}
                <ProtectedRouteWrapper
                  triggerElement={
                    <p
                      className="dropdown-hover"
                      style={{ marginLeft: "45px", padding: "5px 10px" }}
                    >
                      <div>
                        <p>All Claimed Timeline</p>
                      </div>
                    </p>
                  }
                  callback={() => router.push(`/my-projects/claim-requests`)}
                >
                  <p
                    className="dropdown-hover"
                    style={{ marginLeft: "45px", padding: "5px 10px" }}
                  >
                    <Link href="">
                      <div>
                        <Link href={"/my-projects/claim-requests"}>
                          All Claimed Timeline
                        </Link>
                      </div>
                    </Link>
                  </p>
                </ProtectedRouteWrapper>
              </AccordionWrapper>
            </div>
            {/* INFO: Profile Section */}
            <ProtectedRouteWrapper
              triggerElement={
                <p className="dropdown-hover">
                  <span>
                    <UserIcon />
                  </span>
                  <span>Profile</span>
                </p>
              }
              callback={() =>
                router.push(
                  `/profile/${userProfileData?.first_name}-${userProfileData?.last_name}`
                )
              }
            >
              <a
                href={`/profile/${userProfileData?.first_name}-${userProfileData?.last_name}`}
                className="dropdown-hover"
              >
                <span>
                  <UserIcon />
                </span>
                <span>Profile</span>
              </a>
            </ProtectedRouteWrapper>
            <AccordionWrapper
              triggerElement={
                <p>
                  <span>
                    <CreditCard />
                  </span>
                  <span>My Orders</span>
                </p>
              }
            >
              <div className="activity-grid">
                {myOrderOptions.map((el, i) => (
                  <ProtectedRouteWrapper
                    key={i}
                    triggerElement={
                      <div
                        className={`${
                          type === el?.activityOption
                            ? "border-[#f1592a]"
                            : null
                        }`}
                      >
                        <span>{el.icon}</span>
                        <p>{el.text}</p>
                      </div>
                    }
                    callback={() => router.push(el?.slug)}
                  >
                    <Link key={i} href={el?.slug}>
                      <div
                        className={`${
                          type === el?.activityOption
                            ? "border-[#f1592a]"
                            : null
                        }`}
                      >
                        <span>{el.icon}</span>
                        <p>{el.text}</p>
                      </div>
                    </Link>
                  </ProtectedRouteWrapper>
                ))}
              </div>
            </AccordionWrapper>

            <p className="p-hr-line"></p>
            {/* INFO: Logout Section */}
            {token && (
              <SheetClose asChild>
                <Link
                  href={""}
                  onClick={() => {
                    toast({
                      variant: "destructive",
                      title: "Log Out Successful",
                    });
                    dispatch(removeToken());
                  }}
                  className="dropdown-hover"
                >
                  <span>
                    <LogOutIcon />
                  </span>
                  <span>Logout</span>
                </Link>
              </SheetClose>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
