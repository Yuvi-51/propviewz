import Blogs from "@/components/drawer-activity/blogs/Blogs";
import Comments from "@/components/drawer-activity/comments/Comments";
import Medias from "@/components/drawer-activity/medias/Medias";
import MyFavourites from "@/components/drawer-activity/my-favourites/MyFavourites";
import ReviewsAndRatings from "@/components/drawer-activity/reviews-ratings/ReviewsRatings";
import TransactionRequests from "@/components/drawer-activity/transaction-requests/TransactionRequests";
import ViewedProjects from "@/components/drawer-activity/viewed-projects/ViewedProjects";
import ViewedTransactions from "@/components/drawer-activity/viewed-transactions/ViewedTransactions";
import Votes from "@/components/drawer-activity/votes/Votes";
import "./activity.scss";

export default async function ActivityPage({ searchParams }) {
  const { tab } = searchParams;
  return (
    <main className="activity-container">
      {tab === "blogs" && <Blogs />}
      {tab === "comments" && <Comments />}
      {tab === "medias" && <Medias />}
      {tab === "my-favourites" && <MyFavourites />}
      {tab === "viewed-projects" && <ViewedProjects />}
      {tab === "reviews-ratings" && <ReviewsAndRatings />}
      {tab === "transaction-requests" && <TransactionRequests />}
      {tab === "viewed-transactions" && <ViewedTransactions />}
      {tab === "votes" && <Votes />}
    </main>
  );
}
