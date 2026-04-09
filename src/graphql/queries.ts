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
      renterTitle
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

export const GET_DASHBOARD_SUMMARY = gql`
query GetDashboardSummary {
  getDashboardSummary {
    data {
      totalUsers
      totalHouses
      totalRenters
      totalRentals
      activeRentalsCount
      pendingRentalsCount
      expiredRentalsCount
      users {
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
      houses {
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
      renters {
        id
        uuid
        fullName
        renterTitle
        phoneNumber
        nidaNumber
        isActive
      }
      activeRentals {
        id
        uuid
        house {
          id
          uuid
          name
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
          renterTitle
          phoneNumber
          nidaNumber
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
      pendingRentals {
        id
        uuid
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
      expiredRentals {
        id
        uuid
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

export const GET_DISTRICTS = gql`
query GetDistricts($filtering: DistrictFilteringInputObject) {
  getDistricts(filtering: $filtering) {
    data {
      id
      districtUniqueId
      districtName
      districtPostcode
      districtNapaId
      districtParentRegion {
        id
        regionalUniqueId
        reginalName
        reginalPostcode
        reginalNapaId
        reginalCode
      }
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

export const GET_REGIONS = gql`
query GetRegions($filtering: RegionFilteringInputObject) {
  getRegions(filtering: $filtering) {
    data {
      id
      regionalUniqueId
      reginalName
      reginalPostcode
      reginalNapaId
      reginalCode
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

export const GET_RENTAL_PAYMENTS = gql`
query GetRentalPayments($filtering: RentalPaymentFilteringInputObject) {
  getRentalPayments(filtering: $filtering) {
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
    response {
      id
      status
      code
      message
    }
  }
}
`;

export const GET_RENTAL_PAYMENT_SUMMARY = gql`
query GetRentalPaymentSummary($rentalUuid: String!) {
  getRentalPaymentSummary(rentalUuid: $rentalUuid) {
    data {
      rentalUuid
      totalAmount
      totalPaid
      balance
      paymentCount
      lastPaymentDate
      paymentHistory {
        id
        uuid
        amount
        paymentDate
        paymentMethod
        paymentType
        status
        notes
        createdAt
        isActive
        rental {
          uuid
          totalAmount
        }
        recordedBy {
          profileUniqueId
          userFirstName
          userLastName
        }
      }
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