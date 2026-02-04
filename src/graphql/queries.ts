import { gql } from '@apollo/client';


export const GET_USER_PROFILE =gql `
query GetUserProfileAndRole {
  getUserProfileAndRole {
    response {
      id
      status
      code
      message
    }
    data {
      id
      userProfile {
        id
        profileUniqueId
        userFirstName
        userLastName
        userEmail
        profilePhone
        profileTitle
        profilePhoto
        profileIsActive
        profileType
        profileLevel
        profileGender
      }
      userRoles {
        id
        roleUniqueId
        roleName
        roleDescription
        rolePermissions {
          id
          permissionUniqueId
          permissionName
          permissionCode
        }
      }
    }
  }
}
`
;


export const GET_USERS = gql
`
query GetUsers($filtering: UserFilteringInputObject) {
  getUsers(filtering: $filtering) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      profileUniqueId
      userFirstName
      userLastName
      userEmail
      profileType
      profileTitle
      profilePhoto
      profilePhone
      profileLevel
      profileIsActive
      profileGender
      password
    }
  }
}
`


export const GET_HOUSES = gql
`
query GetHouses($filtering: HouseFilteringInputObject) {
  getHouses(filtering: $filtering) {
    data {
      id
      uuid
      name
      ownerInfo {
        id
        profileUniqueId
        userFirstName
        userLastName
        userEmail
        profilePhone
        profileTitle
        profilePhoto
        profileIsActive
        profileType
        profileLevel
        profileGender
      }
      address
      description
      isActive
    }
    response {
      id
      status
      code
      message
    }
  }
}
`


export const GET_ROOMS = gql
`
query GetRooms($filtering: RoomFilteringInputObject) {
  getRooms(filtering: $filtering) {
    data {
      uuid
      houseInfo {
        id
        uuid
        name
        ownerInfo {
          id
          profileUniqueId
          userFirstName
          userLastName
          userEmail
          profilePhone
          profileTitle
          profilePhoto
          profileIsActive
          profileType
          profileLevel
          profileGender
        }
        address
        description
        isActive
      }
      name
      number
      capacity
      pricePerNight
      isActive
    }
    response {
      id
      status
      code
      message
    }
  }
}
`;
