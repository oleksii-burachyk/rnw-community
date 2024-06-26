// https://developer.apple.com/documentation/contacts/cnpostaladdress?language=objc
export interface IosCNPostalAddress {
    isoCountryCode: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
    street: string;
    subAdministrativeArea: string;
    subLocality: string;
}
