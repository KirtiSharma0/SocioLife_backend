const createCategory = async (
  category: string
): Promise<string | undefined> => {
  try {
    const newCategoryName = category.toLowerCase();

    const existingCategory = await Category.findOne({ name: newCategoryName });
    if (!existingCategory) {
      const createdCategory = new Category({ name: newCategoryName });
      await createdCategory.save();
      return createdCategory._id.toJSON();
    }
    return existingCategory._id.toJSON();
  } catch (error) {
    console.log("category couldnt be created", error);
  }
};