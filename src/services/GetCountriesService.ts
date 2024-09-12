// src/services/GetCountriesService.ts

interface ICountriesService<T> {
	getData(): Promise<T | { error: string }>
}

interface RequestHeaders {
	[key: string]: string
}

class GetCountriesService<T> implements ICountriesService<T> {
	private baseURL: string
	private headers: RequestHeaders

	constructor(
		baseURL: string = process.env.REACT_APP_API_BASE_URL || "",
		headers: RequestHeaders = { accept: "*/*" },
	) {
		this.baseURL = baseURL
		this.headers = headers
	}

	public async getData(): Promise<T | { error: string }> {
		return [
			{ iso: "AF", pais: "Afghanistan" },
			{ iso: "AL", pais: "Albania" },
			{ iso: "DZ", pais: "Algeria" },
			{ iso: "AS", pais: "American Samoa" },
			{ iso: "AD", pais: "Andorra" },
			{ iso: "AO", pais: "Angola" },
			{ iso: "AI", pais: "Anguilla" },
			{ iso: "AQ", pais: "Antarctica" },
			{ iso: "AG", pais: "Antigua and Barbuda" },
			{ iso: "AR", pais: "Argentina" },
			{ iso: "AM", pais: "Armenia" },
			{ iso: "AW", pais: "Aruba" },
			{ iso: "AU", pais: "Australia" },
			{ iso: "AT", pais: "Austria" },
			{ iso: "AZ", pais: "Azerbaijan" },
			{ iso: "BS", pais: "Bahamas" },
			{ iso: "BH", pais: "Bahrain" },
			{ iso: "BD", pais: "Bangladesh" },
			{ iso: "BB", pais: "Barbados" },
			{ iso: "BY", pais: "Belarus" },
			{ iso: "BE", pais: "Belgium" },
			{ iso: "BZ", pais: "Belize" },
			{ iso: "BJ", pais: "Benin" },
			{ iso: "BM", pais: "Bermuda" },
			{ iso: "BT", pais: "Bhutan" },
			{ iso: "BO", pais: "Bolivia" },
			{ iso: "BA", pais: "Bosnia and Herzegovina" },
			{ iso: "BW", pais: "Botswana" },
			{ iso: "BR", pais: "Brazil" },
			{ iso: "BN", pais: "Brunei" },
			{ iso: "BG", pais: "Bulgaria" },
			{ iso: "BF", pais: "Burkina Faso" },
			{ iso: "BI", pais: "Burundi" },
			{ iso: "KH", pais: "Cambodia" },
			{ iso: "CM", pais: "Cameroon" },
			{ iso: "CA", pais: "Canada" },
			{ iso: "CV", pais: "Cape Verde" },
			{ iso: "KY", pais: "Cayman Islands" },
			{ iso: "CF", pais: "Central African Republic" },
			{ iso: "TD", pais: "Chad" },
			{ iso: "CL", pais: "Chile" },
			{ iso: "CN", pais: "China" },
			{ iso: "CO", pais: "Colombia" },
			{ iso: "KM", pais: "Comoros" },
			{ iso: "CG", pais: "Congo" },
			{ iso: "CD", pais: "Congo (Democratic Republic)" },
			{ iso: "CR", pais: "Costa Rica" },
			{ iso: "HR", pais: "Croatia" },
			{ iso: "CU", pais: "Cuba" },
			{ iso: "CY", pais: "Cyprus" },
			{ iso: "CZ", pais: "Czech Republic" },
			{ iso: "DK", pais: "Denmark" },
			{ iso: "DJ", pais: "Djibouti" },
			{ iso: "DM", pais: "Dominica" },
			{ iso: "DO", pais: "Dominican Republic" },
			{ iso: "EC", pais: "Ecuador" },
			{ iso: "EG", pais: "Egypt" },
			{ iso: "SV", pais: "El Salvador" },
			{ iso: "GQ", pais: "Equatorial Guinea" },
			{ iso: "ER", pais: "Eritrea" },
			{ iso: "EE", pais: "Estonia" },
			{ iso: "SZ", pais: "Eswatini" },
			{ iso: "ET", pais: "Ethiopia" },
			{ iso: "FJ", pais: "Fiji" },
			{ iso: "FI", pais: "Finland" },
			{ iso: "FR", pais: "France" },
			{ iso: "GA", pais: "Gabon" },
			{ iso: "GM", pais: "Gambia" },
			{ iso: "GE", pais: "Georgia" },
			{ iso: "DE", pais: "Germany" },
			{ iso: "GH", pais: "Ghana" },
			{ iso: "GR", pais: "Greece" },
			{ iso: "GD", pais: "Grenada" },
			{ iso: "GU", pais: "Guam" },
			{ iso: "GT", pais: "Guatemala" },
			{ iso: "GN", pais: "Guinea" },
			{ iso: "GW", pais: "Guinea-Bissau" },
			{ iso: "GY", pais: "Guyana" },
			{ iso: "HT", pais: "Haiti" },
			{ iso: "HN", pais: "Honduras" },
			{ iso: "HK", pais: "Hong Kong" },
			{ iso: "HU", pais: "Hungary" },
			{ iso: "IS", pais: "Iceland" },
			{ iso: "IN", pais: "India" },
			{ iso: "ID", pais: "Indonesia" },
			{ iso: "IR", pais: "Iran" },
			{ iso: "IQ", pais: "Iraq" },
			{ iso: "IE", pais: "Ireland" },
			{ iso: "IL", pais: "Israel" },
			{ iso: "IT", pais: "Italy" },
			{ iso: "JM", pais: "Jamaica" },
			{ iso: "JP", pais: "Japan" },
			{ iso: "JO", pais: "Jordan" },
			{ iso: "KZ", pais: "Kazakhstan" },
			{ iso: "KE", pais: "Kenya" },
			{ iso: "KI", pais: "Kiribati" },
			{ iso: "KP", pais: "North Korea" },
			{ iso: "KR", pais: "South Korea" },
			{ iso: "KW", pais: "Kuwait" },
			{ iso: "KG", pais: "Kyrgyzstan" },
			{ iso: "LA", pais: "Laos" },
			{ iso: "LV", pais: "Latvia" },
			{ iso: "LB", pais: "Lebanon" },
			{ iso: "LS", pais: "Lesotho" },
			{ iso: "LR", pais: "Liberia" },
			{ iso: "LY", pais: "Libya" },
			{ iso: "LI", pais: "Liechtenstein" },
			{ iso: "LT", pais: "Lithuania" },
			{ iso: "LU", pais: "Luxembourg" },
			{ iso: "MO", pais: "Macau" },
			{ iso: "MK", pais: "North Macedonia" },
			{ iso: "MG", pais: "Madagascar" },
			{ iso: "MW", pais: "Malawi" },
			{ iso: "MY", pais: "Malaysia" },
			{ iso: "MV", pais: "Maldives" },
			{ iso: "ML", pais: "Mali" },
			{ iso: "MT", pais: "Malta" },
			{ iso: "MH", pais: "Marshall Islands" },
			{ iso: "MR", pais: "Mauritania" },
			{ iso: "MU", pais: "Mauritius" },
			{ iso: "MX", pais: "Mexico" },
			{ iso: "FM", pais: "Micronesia" },
			{ iso: "MD", pais: "Moldova" },
			{ iso: "MC", pais: "Monaco" },
			{ iso: "MN", pais: "Mongolia" },
			{ iso: "ME", pais: "Montenegro" },
			{ iso: "MA", pais: "Morocco" },
			{ iso: "MZ", pais: "Mozambique" },
			{ iso: "MM", pais: "Myanmar" },
			{ iso: "NA", pais: "Namibia" },
			{ iso: "NR", pais: "Nauru" },
			{ iso: "NP", pais: "Nepal" },
			{ iso: "NL", pais: "Netherlands" },
			{ iso: "NZ", pais: "New Zealand" },
			{ iso: "NI", pais: "Nicaragua" },
			{ iso: "NE", pais: "Niger" },
			{ iso: "NG", pais: "Nigeria" },
			{ iso: "NO", pais: "Norway" },
			{ iso: "OM", pais: "Oman" },
			{ iso: "PK", pais: "Pakistan" },
			{ iso: "PW", pais: "Palau" },
			{ iso: "PA", pais: "Panama" },
			{ iso: "PG", pais: "Papua New Guinea" },
			{ iso: "PY", pais: "Paraguay" },
			{ iso: "PE", pais: "Peru" },
			{ iso: "PH", pais: "Philippines" },
			{ iso: "PL", pais: "Poland" },
			{ iso: "PT", pais: "Portugal" },
			{ iso: "QA", pais: "Qatar" },
			{ iso: "RO", pais: "Romania" },
			{ iso: "RU", pais: "Russia" },
			{ iso: "RW", pais: "Rwanda" },
			{ iso: "KN", pais: "Saint Kitts and Nevis" },
			{ iso: "LC", pais: "Saint Lucia" },
			{ iso: "VC", pais: "Saint Vincent and the Grenadines" },
			{ iso: "WS", pais: "Samoa" },
			{ iso: "SM", pais: "San Marino" },
			{ iso: "ST", pais: "Sao Tome and Principe" },
			{ iso: "SA", pais: "Saudi Arabia" },
			{ iso: "SN", pais: "Senegal" },
			{ iso: "RS", pais: "Serbia" },
			{ iso: "SC", pais: "Seychelles" },
			{ iso: "SL", pais: "Sierra Leone" },
			{ iso: "SG", pais: "Singapore" },
			{ iso: "SK", pais: "Slovakia" },
			{ iso: "SI", pais: "Slovenia" },
			{ iso: "SB", pais: "Solomon Islands" },
			{ iso: "SO", pais: "Somalia" },
			{ iso: "ZA", pais: "South Africa" },
			{ iso: "SS", pais: "South Sudan" },
			{ iso: "ES", pais: "Spain" },
			{ iso: "LK", pais: "Sri Lanka" },
			{ iso: "SD", pais: "Sudan" },
			{ iso: "SR", pais: "Suriname" },
			{ iso: "SE", pais: "Sweden" },
			{ iso: "CH", pais: "Switzerland" },
			{ iso: "SY", pais: "Syria" },
			{ iso: "TW", pais: "Taiwan" },
			{ iso: "TJ", pais: "Tajikistan" },
			{ iso: "TZ", pais: "Tanzania" },
			{ iso: "TH", pais: "Thailand" },
			{ iso: "TL", pais: "Timor-Leste" },
			{ iso: "TG", pais: "Togo" },
			{ iso: "TO", pais: "Tonga" },
			{ iso: "TT", pais: "Trinidad and Tobago" },
			{ iso: "TN", pais: "Tunisia" },
			{ iso: "TR", pais: "Turkey" },
			{ iso: "TM", pais: "Turkmenistan" },
			{ iso: "TV", pais: "Tuvalu" },
			{ iso: "UG", pais: "Uganda" },
			{ iso: "UA", pais: "Ukraine" },
			{ iso: "AE", pais: "United Arab Emirates" },
			{ iso: "GB", pais: "United Kingdom" },
			{ iso: "US", pais: "United States" },
			{ iso: "UY", pais: "Uruguay" },
			{ iso: "UZ", pais: "Uzbekistan" },
			{ iso: "VU", pais: "Vanuatu" },
			{ iso: "VE", pais: "Venezuela" },
			{ iso: "VN", pais: "Vietnam" },
			{ iso: "YE", pais: "Yemen" },
			{ iso: "ZM", pais: "Zambia" },
			{ iso: "ZW", pais: "Zimbabwe " },
		] as T
	}
}

export default GetCountriesService
