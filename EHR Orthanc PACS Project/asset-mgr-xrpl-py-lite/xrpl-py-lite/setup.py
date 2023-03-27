import setuptools

with open("README.md", "r") as fh:
    description = fh.read()
  
setuptools.setup(
    name="litexrpl",
    version="1.2.1",
    author="Obiajulu_M",
    author_email="oambanefo@outlook.com",
    packages=setuptools.find_packages(),
    description="A lite XRPL SDK for python devs, to focus on developing real world applications, while keeping out the ambiguity",
    long_description=description,
    long_description_content_type="text/markdown",
    url="https://github.com/ObiajuluM/xrpl-py-lite",
    license='MIT',
    python_requires='>=3.8',
        classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    install_requires=["xrpl-py", "cryptoconditions"])
