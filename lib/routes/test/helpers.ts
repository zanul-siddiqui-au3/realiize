
      // NPM Dependencies
      import * as status from 'http-status';
      import * as StandardError from 'standard-error';

      // Internal Dependencies
      import { Test } from '../../db';
      export class TestHelpers {
    
      public static findOne = async (id: string) => {
        return await Test
          .findById(id)
          .populate('');
      };
      public static findAll = async (query) => {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.pageSize) || 50;
      const skips = (page - 1) * limit;
      const searchValue = query.searchValue;
      if (searchValue.length) {
        return await Test.aggregate([
          {
            $match: {
              $text: { $search: searchValue },
            },
          },
          {
            $facet: {
              data: [
                {
                  $skip: skips,
                },
                {
                  $limit: limit,
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
        return await  Test.aggregate([
          {
            $facet: {
              data: [
                {
                  $skip: skips,
                },
                {
                  $limit: limit,
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
    }
    public static findAndUpdate = async ({ id, update }) => {
      return await Test
        .findByIdAndUpdate(id, update, { new: true })
        .populate('');
    }
    public static create = async (document) => {
              return await Test
                .create(document);
          };
          public static softDelete = async (id) => {
      return await Test
        .findByIdAndUpdate(id, { isVisible: false });
    }
    public static authenticate = (doc, user) => {
      if (doc.user._id.toString() !== user._id.toString()) {
        throw new StandardError({ message: 'This document does not belong to the user', code: status.UNAUTHORIZED })
      }
    }}
    