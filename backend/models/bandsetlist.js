const dynamoose = require('dynamoose')

const bandSetlistSchema = new dynamoose.Schema(
  {
    pk: {
      type: String,
      hashKey: true,
    },
    sk: {
      type: String,
      rangeKey: true,
      index: {
        name: 'GSI1',
        global: true,
        rangeKey: 'data',
        project: [
          'username',
          'name',
          'id',
          'data',
          'sk',
          'pk',
          'title',
          'artist',
          'setlistName',
          'indexInSetlist',
        ],
      },
    },
    data: {
      type: String,
    },
    username: String,
    name: String,
    passwordHash: String,
    securityQuestion: String,
    securityAnswerHash: String,
    id: String,
    title: String,
    artist: String,
    duration: Number,
    delay: Number,
    notes: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            instrument: String,
            rows: {
              type: Array,
              schema: [
                {
                  type: Object,
                  schema: {
                    rowNumber: Number,
                    contents: String,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    pages: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            pageNumber: Number,
            duration: Number,
            delay: Number,
            rows: {
              type: Array,
              schema: [
                {
                  type: Object,
                  schema: {
                    rowNumber: Number,
                    rowType: {
                      type: String,
                      enum: ['Label', 'Chords', 'Lyrics'],
                    },
                    contents: String,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    setlistName: String,
    indexInSetlist: Number,
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
)

const BandSetlist = dynamoose.model('BandSetlist', bandSetlistSchema, {
  throughput: 'ON_DEMAND',
})

module.exports = BandSetlist
