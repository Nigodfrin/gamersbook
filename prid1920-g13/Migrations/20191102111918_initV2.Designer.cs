﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using prid_1819_g13.Models;

namespace prid_1819_g13.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20191102111918_initV2")]
    partial class initV2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("prid_1819_g13.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("BirthDate");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FirstName")
                        .HasMaxLength(50);

                    b.Property<string>("LastName")
                        .HasMaxLength(50);

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<string>("Pseudo")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<int>("Reputation");

                    b.Property<int>("Role");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Pseudo")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "nicolas.godfrin@live.be",
                            FirstName = "Nicolas",
                            LastName = "Godfrin",
                            Password = "123",
                            Pseudo = "Nico",
                            Reputation = 5,
                            Role = 0
                        },
                        new
                        {
                            Id = 2,
                            Email = "raphCosta@hotmail.com",
                            FirstName = "Raphael",
                            LastName = "Costa",
                            Password = "123",
                            Pseudo = "Raph",
                            Reputation = 2,
                            Role = 0
                        },
                        new
                        {
                            Id = 3,
                            Email = "admin@hotmail.com",
                            FirstName = "admin",
                            LastName = "admin",
                            Password = "admin",
                            Pseudo = "admin",
                            Reputation = 5,
                            Role = 2
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
