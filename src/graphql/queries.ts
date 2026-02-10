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


export const GET_RENTERS = gql
`
query GetRenters($filtering: RenterFilteringInputObject) {
  getRenters(filtering: $filtering) {
    data {
      id
      uuid
      fullName
      phoneNumber
      nidaNumber
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


export const GET_NOTIFICATIONS = gql
`
query GetNotification($filtering: NotificationFilteringInputObject) {
  getNotification(filtering: $filtering) {
    data {
      uuid
      medium
      payload
      status
      attempts
      errorMessage
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


export const GET_HOUSE_RENTALS = gql
`
query GetHouseRentals($filtering: HouseRentalFilteringInputObject) {
  getHouseRentals(filtering: $filtering) {
    data {
      id
      uuid
      house {
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
      owner {
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
      renter {
        id
        uuid
        fullName
        phoneNumber
        nidaNumber
        isActive
      }
      duration
      noticePeriodDays
      amount
      autoRenew
      status
      expiredAt
      terminatedAt
      createdAt
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