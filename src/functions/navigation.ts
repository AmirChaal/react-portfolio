import { useNavigate, type NavigateFunction } from "react-router";

export function goToHome(navigateFunction: NavigateFunction) {
   navigateFunction("/home")
}

export function goToWorks(navigateFunction: NavigateFunction) {
   navigateFunction("/works")
}

export function goToAbout(navigateFunction: NavigateFunction) {
   navigateFunction("/about")
}