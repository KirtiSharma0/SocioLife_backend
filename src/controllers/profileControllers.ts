export const fetchProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const user: IUser | null = await User.findById(profileId).lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
    return;
  }
};