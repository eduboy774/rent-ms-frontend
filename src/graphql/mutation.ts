
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

export const CREATE_MY_ACCOUNT = gql
`
mutation CreateMyAccountMutation($input: UserInputObject!) {
  createMyAccountMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      user_profile {
        profile_unique_id
        user_first_name
        user_last_name
        user_email
        profile_phone
        profile_title
        profile_photo
        profile_is_active
        profile_type
        profile_level
        profile_gender
      }
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


export const UPDATE_USERS = gql
`
mutation UpdateUsersMutation($input: UserInputObject!) {
  updateUsersMutation(input: $input) {
    response {
      id
      status
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
      }
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
      renterTitle
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
      renterTitle
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


export const CREATE_HOUSE_RENTAL = gql
`
mutation CreateHouseRentalMutation($input: HouseRentalInputObject) {
  createHouseRentalMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`;

export const UPDATE_HOUSE_RENTAL = gql
`
mutation UpdateHouseRentalMutation($input: HouseRentalInputObject!) {
  updateHouseRentalMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
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
  }
}
`;

export const ACTIVATE_OR_DEACTIVATE_HOUSE_RENTAL = gql
`
mutation DeleteHouseRentalMutation($uuid: String!) {
  deleteHouseRentalMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`;

export const FORGOT_PASSWORD = gql
`
mutation ForgotPasswordMutation($userEmail: String!) {
  forgotPasswordMutation(userEmail: $userEmail) {
    response {
      id
      status
      code
      message
    }
  }
}
`;

export const RESET_PASSWORD = gql
`
mutation ResetPasswordMutation($input: ResetPasswordInput!) {
  resetPasswordMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
  }
}
`;

export const CREATE_RENTAL_PAYMENT = gql`
mutation CreateRentalPaymentMutation($input: RentalPaymentInputObject) {
  createRentalPaymentMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      rental {
        id
        uuid
        house {
          id
          uuid
          name
          description
          isActive
        }
        renter {
          id
          uuid
          fullName
          phoneNumber
          nidaNumber
          renterTitle
          isActive
        }
        duration
        noticePeriodDays
        amount
        totalAmount
        autoRenew
        status
        expiredAt
        terminatedAt
        createdAt
        isActive
      }
      amount
      paymentDate
      paymentMethod
      paymentType
      status
      notes
      recordedBy {
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
      createdAt
      isActive
    }
  }
}
`;

export const UPDATE_RENTAL_PAYMENT = gql`
mutation UpdateRentalPaymentMutation($input: RentalPaymentInputObject) {
  updateRentalPaymentMutation(input: $input) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      rental {
        id
        uuid
        house {
          id
          uuid
          name
          description
          isActive
        }
        renter {
          id
          uuid
          fullName
          phoneNumber
          nidaNumber
          renterTitle
          isActive
        }
        duration
        noticePeriodDays
        amount
        totalAmount
        autoRenew
        status
        expiredAt
        terminatedAt
        createdAt
        isActive
      }
      amount
      paymentDate
      paymentMethod
      paymentType
      status
      notes
      recordedBy {
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
      createdAt
      isActive
    }
  }
}
`;

export const DELETE_RENTAL_PAYMENT = gql`
mutation DeleteRentalPaymentMutation($uuid: String!) {
  deleteRentalPaymentMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
  }
}
`;

export const REFUND_RENTAL_PAYMENT = gql`
mutation RefundRentalPaymentMutation($uuid: String!) {
  refundRentalPaymentMutation(uuid: $uuid) {
    response {
      id
      status
      code
      message
    }
    data {
      id
      uuid
      rental {
        id
        uuid
        house {
          id
          uuid
          name
          description
          isActive
        }
        renter {
          id
          uuid
          fullName
          phoneNumber
          nidaNumber
          renterTitle
          isActive
        }
        duration
        noticePeriodDays
        amount
        totalAmount
        autoRenew
        status
        expiredAt
        terminatedAt
        createdAt
        isActive
      }
      amount
      paymentDate
      paymentMethod
      paymentType
      status
      notes
      recordedBy {
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
      createdAt
      isActive
    }
  }
}
`;