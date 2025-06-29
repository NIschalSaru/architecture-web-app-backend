const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const Banner = require("../model/banner.js");
const { asyncHandler } = require("../services/async.handler.js");

const createOrUpdateBanner = asyncHandler(async (req, res) => {
  const { heading, subHeading, description } = req.body;
  const uploadedVideo = req.files?.video?.[0];
  let videoPath = null;
  const banner = await Banner.findOne();
  if (uploadedVideo) {
    if (banner?.filepath) {
      const sanitizedPath = banner.filepath.replace(/^\/+/, "");
      const oldLocalPath = path.join(__dirname, "..", "storage", sanitizedPath);
      if (fs.existsSync(oldLocalPath)) {
        fs.unlinkSync(oldLocalPath);
      }
    }
    const folderName = dayjs().format("YYYYMMDD");
    videoPath = `/uploads/${folderName}/${uploadedVideo.filename}`;
  }
  if (banner) {
    banner.heading = heading;
    banner.subHeading = subHeading;
    banner.description = description;
    if (uploadedVideo) {
      banner.filename = uploadedVideo.filename;
      banner.filepath = videoPath;
    }
    await banner.save();
    return res.status(200).json({
      message: "Banner updated successfully",
      data: {
        heading: banner.heading,
        subHeading: banner.subHeading,
        description: banner.description,
        filename: banner.filename,
        filepath: banner.filepath,
      },
    });
  }
  const newBanner = await Banner.create({
    heading,
    subHeading,
    description,
    filename: uploadedVideo?.filename || null,
    filepath: videoPath || null,
  });
  return res.status(201).json({
    message: "Banner created successfully",
    data: {
      heading: newBanner.heading,
      subHeading: newBanner.subHeading,
      description: newBanner.description,
      filename: newBanner.filename,
      filepath: newBanner.filepath,
    },
  });
});

const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findOne();
  if (banner) {
    return res.status(200).json({ success: true, data: banner });
  } else {
    return res
      .status(404)
      .json({ success: false, message: "No recent banner found" });
  }
});

module.exports = {
  createOrUpdateBanner,
  getBanner,
};
