export const handleLike = async (req: Request, res: Response) => {
  try {
    const { like, targetType, targetId } = req.params;
    if (!targetType || !targetId) {
      res.status(400).json({
        success: false,
        message: "some required fields arent present",
      });
      return;
    }

    if (!isValidObjectId(targetId)) {
      res.status(400).json({
        success: false,
        message: "invalid content id",
      });
      return;
    }
    const allowedTargetTypeValues = ["notice", "event", "comment"];
    if (!allowedTargetTypeValues.includes(targetType)) {
      res.status(400).json({
        success: false,
        message: "invalid target type",
      });
      return;
    }

    if(like!==LikeType.LIKE && like!==LikeType.UNLIKE){
      res.status(400).json({
        success: false,
        message: "invalid request"
      })
      return;
    }

    const { user } = req as any as { user: userType };
    let trueTarget;

    switch (targetType) {
      case ResourceType.NOTICE:
        const notice = await Notice.findById(targetId);
        trueTarget = notice;
        break;

      case ResourceType.EVENT:
        const event = await Event.findById(targetId);
        trueTarget = event;
        break;

      case ResourceType.COMMENT:
        const comment = await Comment.findById(targetId);
        trueTarget = comment;
        break;
    }

    if (!trueTarget) {
      res.status(400).json({
        success: false,
        message: "target content not found",
      });
      return;
    }

    if (like === LikeType.LIKE) {
      const existingLike = await Like.findOne({
        userId: user._id,
        targetType,
        target: trueTarget
      })
      if(existingLike){
        res.status(409).json({
          success: false,
          message: "content already liked"
        });
        return;
      }

      const newLike = new Like({
        userId: user._id,
        targetType,
        target: trueTarget,
      });

      await newLike.save();
      trueTarget.likeCount++;
      await trueTarget.save();

      res.status(201).json({
        success: true,
        message: "liked successfully",
      });
      return;
    } else {
      const deletedLike = await Like.findOneAndDelete({
        userId: user._id,
        targetType,
        target: trueTarget
      });

      if(!deletedLike){
        res.status(409).json({
          success: false,
          message: "like doesnt exist"
        });
        return;
      }
      trueTarget.likeCount--;
      await trueTarget.save();
      res.status(200).json({
        success: true,
        message: "content unliked successfully"
      });
      return;
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
    return;
  }
};