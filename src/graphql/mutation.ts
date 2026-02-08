
import { gql } from '@apollo/client';


export const CREATE_HOUSE = gql
`
mutation CreateHouseMutation($input: HouseInputObject) {
  createHouseMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`

export const UPDATE_HOUSE = gql
`
mutation UpdateHouseMutation($input: HouseInputObject) {
  updateHouseMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`


export const ACTIVATE_OR_DEACTIVATE_HOUSE = gql
`
mutation DeleteHouseMutation($uuid: String) {
  deleteHouseMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`


export const UPLOAD_SINGLE_FILE = gql
`
mutation UploadSingleFile($input: Base64StringInputObjects) {
  uploadSingleFile(input: $input) {
    response {
      id
      status
      code
      message
    }
    attachmentPath 
  }
}
`
export const CREATE_USER = gql
`
mutation CreateUsersMutation($input: UserInputObject!) {
  createUsersMutation(input: $input) {
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

export const UPDATE_USER = gql
`
mutation UpdateHouseMutation($input: HouseInputObject) {
  updateHouseMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`


export const ACTIVATE_OR_DEACTIVATE_USER = gql
`
mutation DeleteUsersMutation($profileUniqueId: String!) {
  deleteUsersMutation(profileUniqueId: $profileUniqueId) {
    response {
      id
      status
      code
      message
    }
  }
}
`

export const CREATE_RENTER = gql
`
mutation CreateRenterMutation($input: RenterInputObject) {
  createRenterMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      fullName
      phoneNumber
      nidaNumber
      isActive
    }
  }
}
`

export const UPDATE_RENTER = gql
`
mutation UpdateRenterMutation($input: RenterInputObject) {
  updateRenterMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      fullName
      phoneNumber
      nidaNumber
      isActive
    }
  }
}
`


export const ACTIVATE_OR_DEACTIVATE_RENTER = gql
`
mutation DeleteRenterMutation($uuid: String) {
  deleteRenterMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`


export const CREATE_ROOM_RENTAL = gql
`
mutation CreateRoomRentalMutation($input: RoomRentalInputObject) {
  createRoomRentalMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      room {
        id
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
      renter {
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
      period
      status
      createdAt
      isActive
    }
  }
}
`;

export const UPDATE_ROOM_RENTAL = gql
`
mutation UpdateRoomRentalMutation($input: RoomRentalInputObject) {
  updateRoomRentalMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      room {
        id
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
      renter {
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
      period
      status
      createdAt
      isActive
    }
  }
}
`;

export const ACTIVATE_OR_DEACTIVATE_ROOM_RENTAL = gql
`
mutation DeleteRoomRentalMutation($uuid: String!) {
  deleteRoomRentalMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`