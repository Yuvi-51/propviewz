import {
  AlbumIcon,
  CheckSquareIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  FilmIcon,
  HeartIcon,
  LayoutGridIcon,
  MessageSquareIcon,
  PenLineIcon,
  ReceiptIcon,
  RepeatIcon,
  ScrollText,
  StarIcon,
  Text,
  ThumbsUpIcon,
  View,
} from "lucide-react";

export const userActivityOptions = [
  {
    text: "Viewed TXNs",
    icon: <LayoutGridIcon />,
    slug: "/activity?tab=viewed-transactions",
    action: "Selected Viewed Txn's tab from Hamburger Menu",
    activityOption: "viewed-transactions",
  },
  {
    text: "Reviews & Ratings",
    icon: <StarIcon />,
    slug: "/activity?tab=reviews-ratings",
    action: "Selected Viewed Review & Rating tab from Hamburger Menu",
    activityOption: "reviews-ratings",
  },
  {
    text: "Medias",
    icon: <FilmIcon />,
    slug: "/activity?tab=medias",
    action: "Selected Viewed Media tab from Hamburger Menu",
    activityOption: "medias",
  },
  {
    text: "Comment",
    icon: <MessageSquareIcon />,
    slug: "/activity?tab=comments",
    action: "Selected Viewed Comment tab from Hamburger Menu",
    activityOption: "comments",
  },
  {
    text: "Votes",
    icon: <ThumbsUpIcon />,
    slug: "/activity?tab=votes",
    action: "Selected Viewed Vote tab from Hamburger Menu",
    activityOption: "votes",
  },
  {
    text: "My Favorites",
    icon: <HeartIcon />,
    slug: "/activity?tab=my-favourites",
    action: "Selected My favorites tab from Hamburger Menu",
    activityOption: "my-favourites",
  },
  // {
  //   text: "Blogs",
  //   icon: <AlbumIcon />,
  //   slug: "/activity?tab=blogs",
  //   action: "Selected Viewed Blog tab from Hamburger Menu",
  //   activityOption: "blogs",
  // },
  {
    text: "Txn Requests",
    icon: <ReceiptIcon />,
    slug: "/activity?tab=transaction-requests",
    action: "Selected Viewed Transaction tab from Hamburger Menu",
    activityOption: "transaction-requests",
  },
  {
    text: "Viewed Projects",
    icon: <EyeIcon />,
    slug: "/activity?tab=viewed-projects",
    action: "Selected Recently viewed tab from Hamburger Menu",
    activityOption: "viewed-projects",
  },
  // {
  //   text: "All Timeline",
  //   icon: <GanttChartSquareIcon />,
  //   slug: "/activity?tab=all-timeline",
  //   action: "Selected All Timelines tab from Hamburger Menu",
  //   option: 3,
  //   activityOption: "All Timeline",
  // },
];

export const myOrderOptions = [
  {
    text: "Pricing Plans",
    icon: <View />,
    slug: "/orders?type=Order",
    activityOption: "create",
  },
  // {
  //   text: " Valuation Report",
  //   icon: <ScrollText />,
  //   slug: "/orders?type=ValuationReport",
  //   activityOption: "create",
  // },
  // {
  //   text: "Project Planning Report",
  //   icon: <Text />,
  //   slug: "/orders?type=ProjectPlanningReport",
  //   activityOption: "create",
  // },
];
export const userBlogOptions = [
  {
    text: "Create",
    icon: <PenLineIcon />,
    slug: "/my-blogs?type=create",
    activityOption: "create",
  },
  {
    text: "Draft",
    icon: <FileSpreadsheetIcon />,
    slug: "/my-blogs?type=draft",
    activityOption: "draft",
  },
  {
    text: "In Process",
    icon: <RepeatIcon />,
    slug: "/my-blogs?type=in-process",
    activityOption: "in-process",
  },
  {
    text: "Published",
    icon: <CheckSquareIcon />,
    slug: "/my-blogs?type=published",
    activityOption: "published",
  },
];
