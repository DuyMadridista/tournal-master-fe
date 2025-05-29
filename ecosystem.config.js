// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "next-app",
        script: "npm",
        args: "run start",
        cwd: "D:/DuyLuu/tournal-master-fe", // đường dẫn tuyệt đối đến thư mục chứa app
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  