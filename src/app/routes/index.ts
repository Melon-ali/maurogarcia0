import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { TermsAndConditionsRoutes } from "../modules/TermsAndConditions/TermsAndConditions.routes";
import { PrivacyPolicyRoutes } from "../modules/PrivacyPolicy/PrivacyPolicy.routes";
import { NotificationRoutes } from "../modules/Notification/Notification.routes";
import { ApartmentRoutes } from "../modules/Apartment/Apartment.routes";
import { ReviewRoutes } from "../modules/Review/Review.routes";
import { LikeRouter } from "../modules/Like/like.routes";
import { AgentRoutes } from "../modules/Agent/Agent.routes";
import { CardRoutes } from "../modules/Card/Card.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/apartments",
    route: ApartmentRoutes,
  },
  {
    path: "/agents",
    route: AgentRoutes,
  },
  {
    path: "/cards",
    route: CardRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/like",
    route: LikeRouter,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/trams",
    route: TermsAndConditionsRoutes,
  },
  {
    path: "/privacy",
    route: PrivacyPolicyRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;