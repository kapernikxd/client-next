import _ from "lodash";
import { BASE_URL } from "../http";
import moment from "moment";
import { EventResponse } from "../../services/event/EventResponse";
import { PostFilesDTO } from "../models";

const IMAGE_MOCK = "";

// const IMAGE_MOCK = ""

export const getStartDate = (date?: string | Date) => date ? moment(date).format("lll") : undefined

export const getPostFirstImage = (post: EventResponse) =>
  post && !_.isEmpty(post.images)
    ? BASE_URL + "images/" + post.images[0].path
    : IMAGE_MOCK;

export const getPostImage = (image: PostFilesDTO) =>
  image
    ? BASE_URL + "images/" + image.path
    : IMAGE_MOCK;

export const getPostTitle = (post: EventResponse) =>
  post && post?.title ? post.title : null;

export const getPostDescription = (post: EventResponse) =>
  post && post?.description ? post.description : null;

export const getPostStartDate = (post?: EventResponse) =>
  post ? getStartDate(post?.startDate) : undefined;

export const getPostEndDate = (post?: EventResponse) =>
  post ? getStartDate(post?.endDate) : undefined;

export const getPostShortStartDate = (post: EventResponse) =>
  post && post?.startDate
    ? moment(post.startDate).format("DD MMMM YYYY")
    : null;

export const getPostShortEndDate = (post: EventResponse) =>
  post && post?.endDate ? moment(post.endDate).format("DD MMMM YYYY") : null;

export const getPostViewLength = (post: EventResponse) =>
  post && post?.views ? post.views.length : 0;

export const getPostLikesLength = (post: EventResponse) => {
  return post && post?.likes ? post.likes.length : 0;
}
export const getPostParticipantsLength = (post: EventResponse) =>
  post && post?.participants ? post.participants.length : 0;

export const isUserParticipantInPost = (post: EventResponse, myId?: string | null) =>
  !!myId && post?.participants?.includes(myId);
  
