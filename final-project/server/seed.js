const CATEGORY_NAMES = [
  'Protein',
  'Vegetable',
  'Ready Made Meal',
  'Dessert',
  'Fruit',
  'Random',
]

const FREEZER_NAMES = ['Kitchen', 'Garage']

export default async function seed({ Category, Freezer, FrozenItem }) {
  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(CATEGORY_NAMES.map((name) => ({ name })))
  }

  if ((await Freezer.countDocuments()) === 0) {
    await Freezer.insertMany(FREEZER_NAMES.map((name) => ({ name })))
  }

  if ((await FrozenItem.countDocuments()) === 0) {
    const categories = await Category.find()
    const freezers = await Freezer.find()
    const categoryId = (name) => categories.find((c) => c.name === name).id
    const freezerId = (name) => freezers.find((f) => f.name === name).id

    await FrozenItem.insertMany([
      {
        name: 'chicken thighs',
        frozenOn: '2026-04-01',
        weight: 2.5,
        categoryId: categoryId('Protein'),
        freezerId: freezerId('Garage'),
      },
      {
        name: 'peas',
        frozenOn: '2026-08-15',
        weight: 1,
        categoryId: categoryId('Vegetable'),
        freezerId: freezerId('Kitchen'),
      },
      {
        name: 'lasagna',
        frozenOn: '2025-12-01',
        weight: 3,
        categoryId: categoryId('Ready Made Meal'),
        freezerId: freezerId('Garage'),
      },
      {
        name: 'ice cream',
        frozenOn: '2026-09-20',
        weight: 0.5,
        categoryId: categoryId('Dessert'),
        freezerId: freezerId('Kitchen'),
      },
      {
        name: 'peaches',
        frozenOn: '2026-07-10',
        weight: 1.5,
        categoryId: categoryId('Fruit'),
        freezerId: freezerId('Kitchen'),
      },
      {
        name: 'white rice',
        frozenOn: '2026-03-18',
        weight: 2,
        categoryId: categoryId('Random'),
        freezerId: freezerId('Garage'),
      },
    ])
  }
}
