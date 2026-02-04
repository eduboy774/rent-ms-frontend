
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
      address
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

export const CREATE_ROOM = gql
`
mutation CreateRoomMutation($input: RoomInputObject) {
  createRoomMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`

export const UPDATE_ROOM = gql
`
mutation UpdateRoomMutation($input: RoomInputObject) {
  updateRoomMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
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
  }
}
`


export const ACTIVATE_OR_DEACTIVATE_ROOM = gql
`
mutation DeleteRoomMutation($uuid: String) {
  deleteRoomMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`







