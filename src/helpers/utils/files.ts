import { EventParticipant } from "../../store/mobx/event";
import { BASE_URL } from "../http";
import { PostFilesDTO } from "../models";
import _ from "lodash";


export const getImagesPath = (images: PostFilesDTO[]) =>
  images && !_.isEmpty(images)
    ? _.map(images, (image) => BASE_URL + "images/" + image.path)
    : [];

export const getImagesParticipantsPath = (images: EventParticipant[]) =>
  images && !_.isEmpty(images)
    ? _.map(images, (image) => BASE_URL + "images/" + image.avatarFile)
    : [];

export const getImagePath = (image: PostFilesDTO) => {
  if(image){
    return BASE_URL + "images/" + image.path;
  }
}