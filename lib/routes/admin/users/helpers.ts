// NPM Dependencies
import * as status from "http-status";
import * as StandardError from "standard-error";
import * as bcrypt from "bcrypt";
// Internal Dependencies
import { User as users } from "../../../db";


export class adminUsersHelpers {

    public static findAll = async ({
        page,
        limit,
        searchValue,
        }) => {
        let skip = (page - 1) * limit;
        let limits = parseInt(limit);

        if (searchValue.length) {
          return await users.aggregate([
            {
              $match: {
                $text: { $search: searchValue },
              },
            },
            {
              $facet: {
                data: [
                  {
                    $skip: skip,
                  },
                  {
                    $limit: limits,
                  },
                ],
                count: [
                  {
                    $count: "count",
                  },
                ],
              },
            },
          ]);
        } else {
          return await users.aggregate([
            {
              $facet: {
                data: [
                  {
                    $skip: skip,
                  },
                  {
                    $limit: limits,
                  },
                ],
                count: [
                  {
                    $count: "count",
                  },
                ],
              },
            },
          ]);
        }
    };

    public static findOne = async (id) => {
        return await users.findById(id);
    };

  }