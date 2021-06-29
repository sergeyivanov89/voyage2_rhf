import { validate as validateEmail } from "email-validator";
import get from "lodash.get";
import set from "lodash.set";
import { format } from "date-fns";

import {
  getMaxArrival,
  getMaxDocumentDoi,
  getMinArrival,
  getMinDocumentDoi,
  getMinBeginDate,
  parseToUTC,
} from "utils";
import {
  FORM_PATHS,
  MAX_COUNTRY_COUNT,
  RUSSIA,
  REGEX_VALIDATION,
  DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
  DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
} from "consts";

const validateDadata = (values, errors, regions, path) => {
  const { addressCdi, flat, region } = get(values, path) || {};
  const addressCdiPath = `${path}.addressCdi`;
  const flatPath = `${path}.flat`;
  const regionPath = `${path}.region`;

  if (!addressCdi) {
    set(errors, addressCdiPath, {
      type: "required",
      message: "Не указан адрес",
    });
  } else {
    const regionFiasId = addressCdi.cdiData?.region_fias_id;
    if (
      regionFiasId &&
      !regions.some(({ fiasId }) => fiasId === regionFiasId)
    ) {
      set(errors, addressCdiPath, {
        type: "validate",
        message: "Регион указанного адреса недоступен",
      });
    }
  }

  if (!flat) {
    set(errors, flatPath, {
      type: "required",
      message: "Не указана квартира",
    });
  }

  if (!region) {
    set(errors, regionPath, {
      type: "required",
      message: "Не указан регион",
    });
  } else {
    const regionFiasId = addressCdi?.cdiData?.region_fias_id;
    if (regionFiasId && regionFiasId !== region.fiasId) {
      set(errors, regionPath, {
        type: "validate",
        message: "Указанный регион не совпадает с регионом указанного адреса",
      });
    }
  }
};

export const resolver = (
  values,
  {
    currentDateTime,
    isPremiumBig,
    maxBeginDate,
    maxBeginDateUTC,
    maxPolicyholderDob,
    maxPolicyholderDobUTC,
    maxTravellerDob,
    maxTravellerDobUTC,
    minPolicyholderDob,
    minPolicyholderDobUTC,
    minTravellerDob,
    minTravellerDobUTC,
    regions,
    stepIndex,
  }
) => {
  const errors = {};

  switch (stepIndex) {
    case 0: {
      const travellers = get(values, FORM_PATHS.TRAVELLERS);
      const tripTypeCode = get(values, FORM_PATHS.TRIP_TYPE_CODE);
      const countries = get(values, FORM_PATHS.COUNTRIES);
      const beginDate = get(values, FORM_PATHS.BEGIN_DATE);
      const arrival = get(values, FORM_PATHS.ARRIVAL);
      const isInTrip = get(values, FORM_PATHS.IS_IN_TRIP);

      const minBeginDate = getMinBeginDate(currentDateTime, isInTrip).getTime();
      const minBeginDateUTC = parseToUTC(minBeginDate);
      const minArrival = getMinArrival(currentDateTime, beginDate).getTime();
      const minArrivalUTC = parseToUTC(minArrival);
      const maxArrival = getMaxArrival(currentDateTime, beginDate).getTime();
      const maxArrivalUTC = parseToUTC(maxArrival);

      travellers.forEach(({ dob }, idx) => {
        const fieldName = `${FORM_PATHS.TRAVELLERS}.${idx}.dob`;
        if (typeof dob !== "number") {
          set(errors, fieldName, {
            type: "required",
            message: "Не указана дата рождения",
          });
        } else if (dob > maxTravellerDobUTC) {
          set(errors, fieldName, {
            type: "max",
            message: `Дата рождения не может быть позднее ${format(
              maxTravellerDob,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (dob < minTravellerDobUTC) {
          set(errors, fieldName, {
            type: "min",
            message: `Дата рождения не может быть ранее ${format(
              minTravellerDob,
              "dd.MM.yyyy"
            )}`,
          });
        }
      });

      if (!countries.length) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "required",
          message: "Не указаны страны пребывания",
        });
      } else if (countries.length > MAX_COUNTRY_COUNT) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "maxCount",
          message: `Вы можете указать не более ${MAX_COUNTRY_COUNT} стран или "ВЕСЬ МИР"`,
        });
      } else if (
        countries.length === 1 &&
        countries[0].country.code === RUSSIA &&
        tripTypeCode === "multiple"
      ) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "noMultipleTripInRussia",
          message:
            "Многократные поездки только по России недоступны для страхования",
        });
      }

      if (tripTypeCode === "single") {
        if (typeof beginDate !== "number") {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "required",
            message: "Не указана дата вылета",
          });
        } else if (beginDate > maxBeginDateUTC) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "max",
            message: `Дата вылета не может быть позднее ${format(
              maxBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (beginDate < minBeginDateUTC) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "min",
            message: `Дата вылета не может быть ранее ${format(
              minBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        }

        if (typeof arrival !== "number") {
          set(errors, FORM_PATHS.ARRIVAL, {
            type: "required",
            message: "Не указана дата возвращения",
          });
        } else {
          if (arrival < minArrivalUTC) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "min",
              message: `Дата возвращения не может быть ранее ${format(
                minArrival,
                "dd.MM.yyyy"
              )}`,
            });
          } else if (arrival > maxArrivalUTC) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "max",
              message: `Дата возвращения не может быть позднее ${format(
                maxArrival,
                "dd.MM.yyyy"
              )}`,
            });
          }
          if (typeof beginDate === "number" && beginDate > arrival) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "laterThanDepartureDate",
              message: "Дата возвращения не может быть ранее даты вылета",
            });
          }
        }
      } else if (tripTypeCode === "multiple") {
        if (typeof beginDate !== "number") {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "required",
            message: "Не указана дата первой поездки",
          });
        } else if (beginDate > maxBeginDateUTC) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "max",
            message: `Дата первой поездки не может быть позднее ${format(
              maxBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (beginDate < minBeginDateUTC) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "min",
            message: `Дата первой поездки не может быть ранее ${format(
              minBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        }
      }

      break;
    }

    case 2: {
      const travellers = get(values, FORM_PATHS.TRAVELLERS);
      const countries = get(values, FORM_PATHS.COUNTRIES);
      const isRussia =
        countries.length === 1 && countries[0].country.code === RUSSIA;
      const regexValidation = REGEX_VALIDATION[isRussia ? "RU_EN" : "EN"];

      travellers.forEach((el, idx) => {
        const mapping = [
          { fieldName: "firstName", required: "Не указано имя" },
          { fieldName: "lastName", required: "Не указана фамилия" },
          { fieldName: "middleName" },
        ];
        mapping.forEach(({ fieldName, required }) => {
          const fullFieldName = `${FORM_PATHS.TRAVELLERS}.${idx}.${fieldName}`;
          const value = el[fieldName];
          if (value) {
            if (!regexValidation.pattern.test(value)) {
              set(errors, fullFieldName, {
                type: "pattern",
                message: regexValidation.message,
              });
            }
          } else if (required) {
            set(errors, fullFieldName, {
              type: "required",
              message: required,
            });
          }
        });
      });

      break;
    }

    case 3: {
      const policyholder = get(values, FORM_PATHS.POLICYHOLDER);
      const isCoverEstateOn = get(values, FORM_PATHS.COVER_ESTATE_ON);
      const { citizenship, dob, email, emailConfirm, phone } = policyholder;
      const isRussia = citizenship.code === "643";
      const regexValidation = REGEX_VALIDATION[isRussia ? "RU" : "RU_EN"];

      const mapping = [
        { fieldName: "firstName", required: "Не указано имя" },
        { fieldName: "lastName", required: "Не указана фамилия" },
        { fieldName: "middleName" },
      ];
      mapping.forEach(({ fieldName, required }) => {
        const fullFieldName = `${FORM_PATHS.POLICYHOLDER}.${fieldName}`;
        const value = policyholder[fieldName];
        if (value) {
          if (!regexValidation.pattern.test(value)) {
            set(errors, fullFieldName, {
              type: "pattern",
              message: regexValidation.message,
            });
          }
        } else if (required) {
          set(errors, fullFieldName, {
            type: "required",
            message: required,
          });
        }
      });

      if (typeof dob !== "number") {
        set(errors, FORM_PATHS.POLICYHOLDER_DOB, {
          type: "required",
          message: "Не указана дата рождения",
        });
      } else if (dob > maxPolicyholderDobUTC) {
        set(errors, FORM_PATHS.POLICYHOLDER_DOB, {
          type: "max",
          message: `Дата рождения не может быть позднее ${format(
            maxPolicyholderDob,
            "dd.MM.yyyy"
          )}`,
        });
      } else if (dob < minPolicyholderDobUTC) {
        set(errors, FORM_PATHS.POLICYHOLDER_DOB, {
          type: "min",
          message: `Дата рождения не может быть ранее ${format(
            minPolicyholderDob,
            "dd.MM.yyyy"
          )}`,
        });
      }

      if (isRussia && !phone) {
        set(errors, FORM_PATHS.POLICYHOLDER_PHONE, {
          type: "required",
          message: "Не указан номер телефона",
        });
      }

      if (!email) {
        set(errors, FORM_PATHS.POLICYHOLDER_EMAIL, {
          type: "required",
          message: "Не указан e-mail",
        });
      } else {
        if (!validateEmail(email)) {
          set(errors, FORM_PATHS.POLICYHOLDER_EMAIL, {
            type: "validate",
            message: "Некорректный формат e-mail",
          });
        }
        if (!emailConfirm) {
          set(errors, FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM, {
            type: "required",
            message: "Подтвердите e-mail",
          });
        } else if (!validateEmail(emailConfirm)) {
          set(errors, FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM, {
            type: "validate",
            message: "Некорректный формат e-mail",
          });
        } else if (emailConfirm !== email) {
          set(errors, FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM, {
            type: "validate",
            message: "Адреса e-mail не совпадают",
          });
        }
      }

      if (isPremiumBig) {
        const {
          doi,
          issued,
          number,
          seria,
          type: { code: typeCode },
        } = policyholder.document;

        switch (typeCode) {
          case DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION.code:
            if (typeof doi !== "number") {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI, {
                type: "required",
                message: "Не указана дата выдачи паспорта",
              });
            } else {
              const maxDoi = getMaxDocumentDoi(currentDateTime).getTime();
              const maxDoiUTC = parseToUTC(maxDoi);
              const minDoi = getMinDocumentDoi(dob).getTime();
              const minDoiUTC = parseToUTC(minDoi);
              if (doi > maxDoiUTC) {
                set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI, {
                  type: "max",
                  message: `Дата выдачи паспорта не может быть позднее ${format(
                    maxDoi,
                    "dd.MM.yyyy"
                  )}`,
                });
              } else if (doi < minDoiUTC) {
                set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI, {
                  type: "min",
                  message:
                    typeof dob === "number"
                      ? "Дата выдачи паспорта не может быть ранее даты рождения"
                      : `Дата выдачи паспорта не может быть ранее ${format(
                          minDoi,
                          "dd.MM.yyyy"
                        )}`,
                });
              }
            }

            if (!issued) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED, {
                type: "required",
                message: "Не указано кем выдан паспорт",
              });
            } else if (!REGEX_VALIDATION.PASSPORT_ISSUED.pattern.test(issued)) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED, {
                type: "pattern",
                message: REGEX_VALIDATION.PASSPORT_ISSUED.message,
              });
            }

            if (!number) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER, {
                type: "required",
                message: "Не указан номер паспорта",
              });
            }

            if (!seria) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES, {
                type: "required",
                message: "Не указана серия паспорта",
              });
            }

            break;

          case DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION.code:
            if (!number) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER, {
                type: "required",
                message: "Не указан номер паспорта",
              });
            } else if (
              !REGEX_VALIDATION.FOREIGN_PASSPORT_NUMBER.pattern.test(number)
            ) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER, {
                type: "pattern",
                message: REGEX_VALIDATION.FOREIGN_PASSPORT_NUMBER.message,
              });
            }

            if (!REGEX_VALIDATION.FOREIGN_PASSPORT_SERIES.pattern.test(seria)) {
              set(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES, {
                type: "pattern",
                message: REGEX_VALIDATION.FOREIGN_PASSPORT_SERIES.message,
              });
            }

            break;

          default:
        }

        validateDadata(
          values,
          errors,
          regions,
          FORM_PATHS.POLICYHOLDER_ADDRESS
        );
      }

      if (isCoverEstateOn) {
        validateDadata(values, errors, regions, FORM_PATHS.FLAT);
      }

      break;
    }

    default:
  }

  return { values, errors };
};
